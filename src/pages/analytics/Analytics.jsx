import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore';

export const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Fetch products
        const productsQuery = query(
          collection(db, 'products'),
          where('sellerId', '==', user.uid)
        );
        const productsSnap = await getDocs(productsQuery);
        let totalViews = 0;
        let totalRevenue = 0;
        const topProducts = [];

        productsSnap.forEach((doc) => {
          const product = doc.data();
          totalViews += product.views || 0;
          const revenue = (product.price || 0) * (product.soldCount || 0);
          totalRevenue += revenue;
          
          topProducts.push({
            name: product.name,
            revenue,
            sold: product.soldCount || 0,
          });
        });

        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('sellerId', '==', user.uid)
        );
        const ordersSnap = await getDocs(ordersQuery);
        const totalOrders = ordersSnap.size;
        const averageOrderValue =
          totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalViews,
          totalOrders,
          totalRevenue,
          averageOrderValue,
          topProducts: topProducts
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const analyticsCards = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Avg Order Value',
      value: `₹${Math.round(stats.averageOrderValue)}`,
      icon: BarChart3,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your sales and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className={`inline-block p-3 rounded-lg mb-4 ${card.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Products</h3>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading analytics...</div>
        ) : stats.topProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No products sold yet</div>
        ) : (
          <div className="space-y-4">
            {stats.topProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sold} sold</p>
                </div>
                <p className="font-bold text-green-600">
                  ₹{product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
