import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ─── Seller Profile ────────────────────────────────────────────────────────────

export const getSellerProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'sellers', uid));
  return snap.exists() ? snap.data() : null;
};

export const createSellerProfile = async (uid, data) => {
  const payload = {
    uid,
    fullName: '',
    shopName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    category: '',
    deliveryRadius: '5',
    gstNumber: '',
    panNumber: '',
    aadhaarNumber: '',
    shopLogo: null,
    shopBanner: null,
    shopPhoto: null,
    verificationStatus: 'Pending',
    verificationNotes: '',
    isVerified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...data,
  };
  await setDoc(doc(db, 'sellers', uid), payload);
  return payload;
};

export const updateSellerProfile = async (uid, updates) => {
  await updateDoc(doc(db, 'sellers', uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// ─── Admin ─────────────────────────────────────────────────────────────────────

export const getAllSellers = async () => {
  const snap = await getDocs(
    query(collection(db, 'sellers'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeAllSellers = (callback) => {
  const q = query(collection(db, 'sellers'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const updateVerificationStatus = async (
  uid,
  status,
  notes = ''
) => {
  const isApproved = status === 'Approved';
  await updateDoc(doc(db, 'sellers', uid), {
    verificationStatus: status,
    verificationNotes: notes,
    isVerified: isApproved,
    updatedAt: serverTimestamp(),
  });
};

// ─── Storage ───────────────────────────────────────────────────────────────────

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {string} uid - Seller UID
 * @param {File} file - File object
 * @param {'shopLogo'|'shopBanner'|'shopPhoto'} field - Which image field
 * @param {Function} onProgress - optional callback(percent)
 */
export const uploadShopImage = (uid, file, field, onProgress) => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop();
    const storageRef = ref(
      storage,
      `sellers/${uid}/${field}_${Date.now()}.${ext}`
    );
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
};
