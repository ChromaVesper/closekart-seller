/**
 * ============================================================
 * CLOSEKART BUYER APP — FIRESTORE INTEGRATION
 * ============================================================
 * Copy this file into the buyer app's src/ directory.
 * It provides all real-time Firestore listeners and
 * Haversine nearby-filtering for products, reels, and sellers.
 *
 * Firebase project: closekart-8f6b0 (shared with seller panel)
 * ============================================================
 */

import { db } from './firebase'; // Adjust path to your buyer app's firebase.js
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
} from 'firebase/firestore';

// ---- Haversine Distance ----

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterByDistance(items, buyerLat, buyerLon, radiusKm) {
  return items
    .filter((item) => {
      if (item.latitude == null || item.longitude == null) return false;
      return haversineDistance(buyerLat, buyerLon, item.latitude, item.longitude) <= radiusKm;
    })
    .map((item) => ({
      ...item,
      distanceKm: haversineDistance(buyerLat, buyerLon, item.latitude, item.longitude).toFixed(1),
    }))
    .sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
}

// ---- Real-time Listeners ----

/**
 * Subscribe to ALL products in real-time (Buyer feed).
 * Call this in useEffect and unsubscribe on cleanup.
 *
 * Usage:
 *   const unsub = subscribeToProducts((products) => setProducts(products));
 *   return () => unsub();
 */
export function subscribeToProducts(callback) {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));
    callback(products);
  });
}

/**
 * Subscribe to ALL reels in real-time.
 */
export function subscribeToReels(callback) {
  const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reels = [];
    snapshot.forEach((doc) => reels.push({ id: doc.id, ...doc.data() }));
    callback(reels);
  });
}

/**
 * Fetch all sellers (one-time).
 */
export async function fetchSellers() {
  const snapshot = await getDocs(collection(db, 'sellers'));
  const sellers = [];
  snapshot.forEach((doc) => sellers.push({ id: doc.id, ...doc.data() }));
  return sellers;
}

// ---- Example React hook ----
// Copy this into buyer app and adapt as needed.
/*
import { useState, useEffect } from 'react';
import { subscribeToProducts, filterByDistance } from './closekartSync';

const RADIUS_OPTIONS = [1, 2, 3, 5, 10];

export function useNearbyProducts(buyerLat, buyerLon, radiusKm = 5) {
  const [allProducts, setAllProducts] = useState([]);
  const [nearbyProducts, setNearbyProducts] = useState([]);

  useEffect(() => {
    const unsub = subscribeToProducts((products) => {
      setAllProducts(products);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (buyerLat && buyerLon) {
      setNearbyProducts(filterByDistance(allProducts, buyerLat, buyerLon, radiusKm));
    } else {
      setNearbyProducts(allProducts); // No location — show everything
    }
  }, [allProducts, buyerLat, buyerLon, radiusKm]);

  return nearbyProducts;
}
*/
