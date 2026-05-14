import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { db, storage } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';

export const Dashboard = () => {
  const { user, sellerData } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [storageTest, setStorageTest] = useState({ status: 'idle', message: '' });

  // ---- Storage Diagnostic ----
  const runStorageTest = async () => {
    setStorageTest({ status: 'running', message: 'Testing storage connection...' });
    const blob = new Blob(['closekart-storage-test'], { type: 'text/plain' });

    // Try current storage (from firebase.js)
    try {
      console.log('[StorageTest] Using storage:', storage?.app?.options?.storageBucket);
      const testRef = ref(storage, `test/ping-${Date.now()}.txt`);
      const snap = await uploadBytes(testRef, blob);
      const url = await getDownloadURL(snap.ref);
      console.log('[StorageTest] SUCCESS with current bucket! URL:', url);
      setStorageTest({
        status: 'success',
        message: `✅ Storage works! Bucket: ${storage?.app?.options?.storageBucket}`,
      });
      return;
    } catch (err) {
      console.error('[StorageTest] Current bucket failed:', err.code, err.message);
    }

    // Try alternate bucket format
    const currentBucket = storage?.app?.options?.storageBucket || '';
    const alternateBucket = currentBucket.includes('.appspot.com')
      ? currentBucket.replace('.appspot.com', '.firebasestorage.app')
      : currentBucket.replace('.firebasestorage.app', '.appspot.com');

    try {
      console.log('[StorageTest] Trying alternate bucket:', alternateBucket);
      const altStorage = getStorage(storage.app, `gs://${alternateBucket}`);
      const testRef = ref(altStorage, `test/ping-${Date.now()}.txt`);
      const snap = await uploadBytes(testRef, blob);
      const url = await getDownloadURL(snap.ref);
      console.log('[StorageTest] SUCCESS with alternate bucket! URL:', url);
      setStorageTest({
        status: 'success',
        message: `✅ Alternate bucket works: ${alternateBucket}. ⚠️ Update your storageBucket config to this value!`,
      });
    } catch (err2) {
      console.error('[StorageTest] Alternate bucket also failed:', err2.code, err2.message);
      setStorageTest({
        status: 'error',
        message: `❌ Both buckets failed. Error: ${err2.code} — ${err2.message}. Check Firebase Console → Storage rules and ensure the bucket exists.`,
      });
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch products count
        const productsQuery = query(
          collection(db, 'products'),
          where('sellerId', '==', user.uid)
        );
        const productsSnap = await getDocs(productsQuery);
        const totalProducts = productsSnap.size;

        // Fetch orders count
        const ordersQuery = query(
          collection(db, 'orders'),
          where('sellerId', '==', user.uid)
        );
        const ordersSnap = await getDocs(ordersQuery);
        const totalOrders = ordersSnap.size;

        // Calculate revenue and views from products
        let totalRevenue = 0;
        let totalViews = 0;

        productsSnap.forEach((doc) => {
          const product = doc.data();
          totalRevenue += (product.price || 0) * (product.soldCount || 0);
          totalViews += product.views || 0;
        });

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          totalViews,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      link: '/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      link: '/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      link: '/analytics',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-orange-50 text-orange-600',
      link: '/analytics',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {sellerData?.shopName || 'Seller'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening on your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className={`inline-block p-3 rounded-lg mb-4 ${card.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{card.value}</h3>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all">
                View details
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Product Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Add New Product</h3>
              <p className="text-blue-100">Upload and manage your products</p>
            </div>
            <Package size={48} className="opacity-20" />
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>

        {/* Upload Reel Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Upload Reel</h3>
              <p className="text-purple-100">Create engaging video content</p>
            </div>
            <Eye size={48} className="opacity-20" />
          </div>
          <Link
            to="/reels"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Plus size={20} />
            Upload Reel
          </Link>
        </div>
      </div>

      {/* Storage Diagnostic Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <FlaskConical size={20} className="text-amber-500" />
          Firebase Storage Diagnostic
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Run this test to identify the exact storage issue. Open browser console (F12) for full details.
        </p>
        <p className="text-xs text-gray-400 mb-3 font-mono">
          Current bucket: <span className="font-bold text-gray-700">{storage?.app?.options?.storageBucket || 'not set'}</span>
        </p>
        <button
          onClick={runStorageTest}
          disabled={storageTest.status === 'running'}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {storageTest.status === 'running' ? '🔄 Testing...' : '🧪 Run Storage Test'}
        </button>
        {storageTest.message && (
          <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
            storageTest.status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : storageTest.status === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {storageTest.message}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h3>
        <ul className="space-y-3">
          <li className="flex gap-3 text-gray-700">
            <span className="text-green-600 font-bold">✓</span>
            <span>Keep your product descriptions detailed and accurate for better sales</span>
          </li>
          <li className="flex gap-3 text-gray-700">
            <span className="text-green-600 font-bold">✓</span>
            <span>Upload high-quality product images to increase conversion rates</span>
          </li>
          <li className="flex gap-3 text-gray-700">
            <span className="text-green-600 font-bold">✓</span>
            <span>Create engaging reels to showcase your products and boost visibility</span>
          </li>
          <li className="flex gap-3 text-gray-700">
            <span className="text-green-600 font-bold">✓</span>
            <span>Check your analytics regularly to understand customer behavior</span>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
};
