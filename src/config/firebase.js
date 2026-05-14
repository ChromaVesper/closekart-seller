import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBoxZUkzf0NebX8Xf9KANWLLY9qexGXfCo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "closekart-8f6b0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "closekart-8f6b0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "closekart-8f6b0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "29503582787",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:29503582787:web:720c9b9059ba5b011e9af6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
