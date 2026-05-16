import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from 'firebase/firestore';

export const AuthContext = createContext();

// ─── Helper: fetch admin UIDs from Firestore ────────────────────────────────────
// Firestore doc: config/adminConfig  →  { adminUids: ['uid1', 'uid2'] }
const fetchAdminUids = async () => {
  try {
    const snap = await getDoc(doc(db, 'config', 'adminConfig'));
    if (snap.exists()) {
      return snap.data().adminUids || [];
    }
    return [];
  } catch {
    return [];
  }
};

// ─── Helper: seed admin in Firestore on first login ────────────────────────────
// Reads VITE_ADMIN_UID env var. If it matches the current user and no admin
// exists yet in Firestore, we bootstrap the adminConfig document automatically.
const seedAdminIfNeeded = async (uid) => {
  const envAdminUid = import.meta.env.VITE_ADMIN_UID;
  if (!envAdminUid || envAdminUid !== uid) return;

  const configRef = doc(db, 'config', 'adminConfig');
  const snap = await getDoc(configRef);

  if (!snap.exists()) {
    // First-time bootstrap: create the admin config
    await setDoc(configRef, {
      adminUids: [uid],
      createdAt: serverTimestamp(),
    });
    console.log('[Admin] Bootstrapped admin config for UID:', uid);
  } else {
    const existing = snap.data().adminUids || [];
    if (!existing.includes(uid)) {
      await setDoc(configRef, { adminUids: [...existing, uid] }, { merge: true });
      console.log('[Admin] Added UID to admin config:', uid);
    }
  }
};

// ─── Helper: build default seller doc ──────────────────────────────────────────
const buildDefaultSeller = (uid, email, displayName = '', phoneNumber = '', photoURL = null) => ({
  uid,
  email,
  shopName: displayName || 'My Shop',
  fullName: displayName || '',
  phoneNumber: phoneNumber || '',
  mobile: phoneNumber || '',
  role: 'seller',
  verified: false,
  verificationStatus: 'Pending',
  verificationNotes: '',
  isVerified: false,
  address: '', city: '', state: '', pincode: '',
  category: '', deliveryRadius: '5',
  gstNumber: '', panNumber: '', aadhaarNumber: '',
  shopLogo: null, shopBanner: null, shopPhoto: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  profileImage: photoURL,
  description: '',
  rating: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true); // separate flag for admin check
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Set Firebase Auth persistence to LOCAL (survives refresh / Vercel) ────────
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.warn('[Auth] Could not set persistence:', err)
    );
  }, []);

  // ── Monitor auth state ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setAdminLoading(true);
      setError(null);

      if (currentUser) {
        setUser(currentUser);

        // 1. Fetch seller data
        try {
          const sellerRef = doc(db, 'sellers', currentUser.uid);
          const sellerSnap = await getDoc(sellerRef);
          setSellerData(sellerSnap.exists() ? sellerSnap.data() : null);
        } catch (err) {
          console.error('Error fetching seller data:', err);
          setError('Failed to load seller data');
        }

        // 2. Auto-seed admin from env if applicable (runs only when VITE_ADMIN_UID matches)
        try {
          await seedAdminIfNeeded(currentUser.uid);
        } catch (err) {
          console.warn('[Admin] Seed check failed:', err);
        }

        // 3. Check admin status from Firestore
        try {
          const adminUids = await fetchAdminUids();
          setIsAdmin(adminUids.includes(currentUser.uid));
        } catch {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setSellerData(null);
        setIsAdmin(false);
      }

      setLoading(false);
      setAdminLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Signup ────────────────────────────────────────────────────────────────────
  const signup = useCallback(async (email, password, shopName, phoneNumber) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const newSeller = {
        ...buildDefaultSeller(uid, email, shopName, phoneNumber),
        shopName, // override with form value
        phoneNumber,
        mobile: phoneNumber,
      };

      await setDoc(doc(db, 'sellers', uid), newSeller);
      setSellerData(newSeller);

      // Check admin on signup (edge case: first user = admin)
      await seedAdminIfNeeded(uid);
      const adminUids = await fetchAdminUids();
      setIsAdmin(adminUids.includes(uid));

      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error('Firebase Signup Error:', err);
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      else if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Email/Password Login ───────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const sellerRef = doc(db, 'sellers', uid);
      const sellerSnap = await getDoc(sellerRef);

      if (sellerSnap.exists()) {
        setSellerData(sellerSnap.data());
      } else {
        const defaultData = buildDefaultSeller(uid, userCredential.user.email);
        await setDoc(sellerRef, defaultData);
        setSellerData(defaultData);
      }

      await seedAdminIfNeeded(uid);
      const adminUids = await fetchAdminUids();
      setIsAdmin(adminUids.includes(uid));

      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error('Firebase Login Error:', err);
      let msg = 'Login failed. Please try again.';
      if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(err.code))
        msg = 'Invalid email or password.';
      else if (err.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
      else if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Google Login ──────────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { uid, email, displayName, phoneNumber, photoURL } = userCredential.user;

      const sellerRef = doc(db, 'sellers', uid);
      const sellerSnap = await getDoc(sellerRef);

      if (sellerSnap.exists()) {
        setSellerData(sellerSnap.data());
      } else {
        const defaultData = buildDefaultSeller(uid, email, displayName, phoneNumber, photoURL);
        await setDoc(sellerRef, defaultData);
        setSellerData(defaultData);
      }

      await seedAdminIfNeeded(uid);
      const adminUids = await fetchAdminUids();
      setIsAdmin(adminUids.includes(uid));

      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error('Firebase Google Auth Error:', err);
      let msg = 'Google Sign-In failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in popup was closed.';
      else if (err.code === 'auth/popup-blocked') msg = 'Popup blocked by browser.';
      else if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setSellerData(null);
      setIsAdmin(false);
      return { success: true };
    } catch (err) {
      const msg = 'Logout failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // ── Update Seller Profile ─────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };
    try {
      setError(null);
      const updatedData = { ...sellerData, ...updates, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'sellers', user.uid), updatedData, { merge: true });
      setSellerData(updatedData);
      return { success: true };
    } catch {
      const msg = 'Failed to update profile';
      setError(msg);
      return { success: false, error: msg };
    }
  }, [user, sellerData]);

  const value = {
    user,
    sellerData,
    isAdmin,
    adminLoading,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isSeller: !!sellerData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
