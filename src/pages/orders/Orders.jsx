import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'orders'),
          where('sellerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersData = [];

        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setOrders(ordersData.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.customerName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{order.totalAmount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status || 'pending'
                        )}`}
                      >
                        {(order.status || 'pending').charAt(0).toUpperCase() +
                          (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.createdAt
                        ? format(order.createdAt.toDate(), 'MMM dd, yyyy')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
