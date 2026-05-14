import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';

export const Settings = () => {
  const { sellerData, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    shopName: sellerData?.shopName || '',
    description: sellerData?.description || '',
    phoneNumber: sellerData?.phoneNumber || '',
    latitude: sellerData?.latitude || '',
    longitude: sellerData?.longitude || '',
    deliveryRadius: sellerData?.deliveryRadius || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to update profile');
    }

    setSaving(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your seller account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SettingsIcon size={28} />
              Profile Settings
            </h2>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Shop Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your shop..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 19.0760"
                    step="0.000001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 72.8777"
                    step="0.000001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Delivery Radius */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Delivery Radius (in km)
                </label>
                <input
                  type="number"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving && <Loader size={20} className="animate-spin" />}
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Email</p>
                <p className="text-lg text-gray-900">{sellerData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Account Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-lg text-gray-900">Active</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Seller Rating</p>
                <p className="text-lg text-gray-900">
                  {'★'.repeat(sellerData?.rating || 0)} ({sellerData?.rating || 0}/5)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sellerData?.totalProducts || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {sellerData?.totalOrders || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{sellerData?.totalRevenue || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-4">
              Check our documentation or contact support for assistance.
            </p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
