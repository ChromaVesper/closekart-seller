import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);
      
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch seller data from Firestore
        try {
          const sellerRef = doc(db, 'sellers', currentUser.uid);
          const sellerSnap = await getDoc(sellerRef);
          
          if (sellerSnap.exists()) {
            setSellerData(sellerSnap.data());
          } else {
            setSellerData(null);
          }
        } catch (err) {
          console.error('Error fetching seller data:', err);
          setError('Failed to load seller data');
        }
      } else {
        setUser(null);
        setSellerData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register new seller
  const signup = useCallback(async (email, password, shopName, phoneNumber) => {
    try {
      setError(null);
      setLoading(true);

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create seller document in Firestore
      const sellerData = {
        uid,
        email,
        shopName,
        phoneNumber,
        role: 'seller',
        verified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileImage: null,
        description: '',
        rating: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };

      await setDoc(doc(db, 'sellers', uid), sellerData);
      
      setSellerData(sellerData);
      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error("Firebase Signup Error: ", err);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login seller
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch seller data
      const sellerRef = doc(db, 'sellers', userCredential.user.uid);
      const sellerSnap = await getDoc(sellerRef);
      
      if (sellerSnap.exists()) {
        setSellerData(sellerSnap.data());
        return { success: true, user: userCredential.user };
      } else {
        // User exists but no seller profile - create one
        const defaultSellerData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          shopName: 'My Shop',
          phoneNumber: '',
          role: 'seller',
          verified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profileImage: null,
          description: '',
          rating: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
        };
        
        await setDoc(doc(db, 'sellers', userCredential.user.uid), defaultSellerData);
        setSellerData(defaultSellerData);
        
        return { success: true, user: userCredential.user };
      }
    } catch (err) {
      console.error("Firebase Login Error: ", err);
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Google Sign In
  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const uid = userCredential.user.uid;

      // Check if seller document exists
      const sellerRef = doc(db, 'sellers', uid);
      const sellerSnap = await getDoc(sellerRef);

      if (sellerSnap.exists()) {
        setSellerData(sellerSnap.data());
        return { success: true, user: userCredential.user };
      } else {
        // Create seller document if not exists
        const defaultSellerData = {
          uid,
          email: userCredential.user.email,
          shopName: userCredential.user.displayName || 'My Shop',
          phoneNumber: userCredential.user.phoneNumber || '',
          role: 'seller',
          verified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profileImage: userCredential.user.photoURL || null,
          description: '',
          rating: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
        };
        
        await setDoc(doc(db, 'sellers', uid), defaultSellerData);
        setSellerData(defaultSellerData);
        
        return { success: true, user: userCredential.user };
      }
    } catch (err) {
      console.error("Firebase Google Auth Error: ", err);
      let errorMessage = 'Google Sign-In failed. Please try again.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked by your browser.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout seller
  const logout = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setSellerData(null);
      return { success: true };
    } catch (err) {
      const errorMessage = 'Logout failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update seller profile
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      setError(null);
      setLoading(true);

      const updatedData = {
        ...sellerData,
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'sellers', user.uid), updatedData, { merge: true });
      setSellerData(updatedData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, sellerData]);

  const value = {
    user,
    sellerData,
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
