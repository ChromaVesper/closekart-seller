import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Loader, MapPin, Navigation } from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';

export const Settings = () => {
  const { sellerData, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    shopName: sellerData?.shopName || '',
    description: sellerData?.description || '',
    phoneNumber: sellerData?.phoneNumber || '',
    address: sellerData?.address || '',
    city: sellerData?.city || '',
    state: sellerData?.state || '',
    pincode: sellerData?.pincode || '',
    latitude: sellerData?.latitude || '',
    longitude: sellerData?.longitude || '',
    deliveryRadius: sellerData?.deliveryRadius || '5',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setDetectingLocation(false);
        setMessage('✅ Location detected! Save to confirm.');
        setTimeout(() => setMessage(''), 4000);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setMessage('Failed to detect location. Please enter manually.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const result = await updateProfile({
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      deliveryRadius: formData.deliveryRadius ? parseFloat(formData.deliveryRadius) : 5,
    });
    if (result.success) {
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } else {
      setMessage('❌ Failed to update profile. Please try again.');
    }
    setSaving(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your seller account, shop info, and location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Message Banner */}
          {message && (
            <div className={`p-4 rounded-lg font-medium ${
              message.startsWith('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Info */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <SettingsIcon size={22} />
                Shop Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Akshay's Electronics"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Shop Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell customers about your shop..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={22} />
                Shop Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., 123, MG Road"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Delivery */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Navigation size={22} />
                GPS Location & Delivery Radius
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Your GPS coordinates are used to show your shop to nearby buyers on the app.
              </p>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {detectingLocation
                    ? <><Loader size={18} className="animate-spin" /> Detecting...</>
                    : <><Navigation size={18} /> Auto-Detect My Location</>
                  }
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g., 19.076090"
                      step="0.000001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g., 72.877426"
                      step="0.000001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery Radius (km)</label>
                  <select
                    name="deliveryRadius"
                    value={formData.deliveryRadius}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 km</option>
                    <option value="2">2 km</option>
                    <option value="3">3 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="50">50 km</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving && <Loader size={20} className="animate-spin" />}
              <Save size={20} />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                <p className="text-sm text-gray-900 font-medium">{sellerData?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-900">Active Seller</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Location Saved</p>
                <p className="text-sm text-gray-900 font-medium">
                  {sellerData?.latitude && sellerData?.longitude
                    ? `${parseFloat(sellerData.latitude).toFixed(4)}, ${parseFloat(sellerData.longitude).toFixed(4)}`
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-sm font-bold text-blue-600">{sellerData?.totalProducts || 0}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-sm font-bold text-green-600">{sellerData?.totalOrders || 0}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-sm font-bold text-purple-600">₹{sellerData?.totalRevenue || 0}</p>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-xs text-blue-800">
              Set your GPS location accurately so buyers nearby can discover your shop on the map!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


