import React, { useState, useCallback, useRef } from 'react';
import {
  User,
  Store,
  Phone,
  Mail,
  MapPin,
  Tag,
  Navigation,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader,
  Save,
  CheckCircle,
  X,
} from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { updateSellerProfile, uploadShopImage } from '../../services/sellerService';
import { SHOP_CATEGORIES, DELIVERY_RADII } from '../../utils/constants';

const inputCls =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition-all';

const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

// ─── Image Upload Field ─────────────────────────────────────────────────────────

const ImageUploadField = ({ label, field, currentUrl, onUpload, uploading }) => {
  const fileRef = useRef();
  const [preview, setPreview] = useState(currentUrl || null);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }
    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Upload
    await onUpload(file, field, setProgress);
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div
        onClick={() => fileRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${
          preview
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
        }`}
        style={{ minHeight: 120 }}
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Upload size={28} className="mb-2" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        {uploading === field && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
            <Loader size={24} className="animate-spin text-blue-600 mb-2" />
            <p className="text-xs font-semibold text-blue-600">{progress}%</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export const SellerProfile = () => {
  const { user, sellerData, updateProfile } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: sellerData?.fullName || '',
    shopName: sellerData?.shopName || '',
    mobile: sellerData?.mobile || sellerData?.phoneNumber || '',
    email: sellerData?.email || user?.email || '',
    address: sellerData?.address || '',
    city: sellerData?.city || '',
    state: sellerData?.state || '',
    pincode: sellerData?.pincode || '',
    category: sellerData?.category || '',
    deliveryRadius: sellerData?.deliveryRadius || '5',
    gstNumber: sellerData?.gstNumber || '',
    panNumber: sellerData?.panNumber || '',
    aadhaarNumber: sellerData?.aadhaarNumber || '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null); // which image is uploading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = useCallback(
    async (file, field, setProgress) => {
      if (!user?.uid) return;
      setUploadingField(field);
      try {
        const url = await uploadShopImage(user.uid, file, field, setProgress);
        // Save to Firestore immediately
        await updateSellerProfile(user.uid, { [field]: url });
        await updateProfile({ [field]: url });
        toast.success(`${field === 'shopLogo' ? 'Logo' : field === 'shopBanner' ? 'Banner' : 'Photo'} uploaded!`);
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Upload failed. Please try again.');
      } finally {
        setUploadingField(null);
      }
    },
    [user, updateProfile, toast]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ ...form });
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const status = sellerData?.verificationStatus || 'Pending';
  const notes = sellerData?.verificationNotes || '';

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
          <p className="text-gray-500 mt-1">
            Complete your profile to get verified and start selling
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          {sellerData?.isVerified && <VerificationBadge size="sm" />}
        </div>
      </div>

      {/* Rejection Banner */}
      {status === 'Rejected' && notes && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <X size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">
              Your account was rejected
            </p>
            <p className="text-red-700 text-sm mt-0.5">{notes}</p>
          </div>
        </div>
      )}

      {/* Under Review Banner */}
      {status === 'Under Review' && (
        <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Loader size={18} className="text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
          <p className="text-blue-800 text-sm font-medium">
            Your profile is currently under review. We'll notify you shortly.
          </p>
        </div>
      )}

      {/* Approved Banner */}
      {status === 'Approved' && (
        <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm font-medium">
            🎉 Congratulations! Your shop is verified and visible to buyers.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT — Main Form */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Rahul Sharma"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={form.shopName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Rahul's Electronics"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Shop Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Shop Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Shop Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 123, MG Road, Andheri West"
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="Mumbai"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="Maharashtra"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      placeholder="400001"
                      maxLength={6}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Store size={20} className="text-blue-600" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Shop Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">Select a category</option>
                    {SHOP_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Delivery Radius</label>
                  <select
                    name="deliveryRadius"
                    value={form.deliveryRadius}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {DELIVERY_RADII.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Verification Fields */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Optional Verification Details
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Providing these helps admins verify your business faster (all optional)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — Images + Status */}
          <div className="xl:col-span-1 space-y-6">

            {/* Verification Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Verification Status
              </h3>
              <div className="flex flex-col gap-3">
                <StatusBadge status={status} />
                {sellerData?.isVerified && (
                  <VerificationBadge showLabel />
                )}
                <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Member since</span>
                    <span className="font-medium">
                      {sellerData?.createdAt?.toDate
                        ? sellerData.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profile complete</span>
                    <span className="font-medium text-blue-600">
                      {Math.min(
                        100,
                        Math.round(
                          ([form.fullName, form.shopName, form.mobile, form.email, form.address, form.city, form.state, form.pincode, form.category]
                            .filter(Boolean).length /
                            9) *
                            100
                        )
                      )}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-600" />
                Shop Images
              </h3>
              <div className="space-y-4">
                <ImageUploadField
                  label="Shop Logo"
                  field="shopLogo"
                  currentUrl={sellerData?.shopLogo}
                  onUpload={handleImageUpload}
                  uploading={uploadingField}
                />
                <ImageUploadField
                  label="Shop Banner"
                  field="shopBanner"
                  currentUrl={sellerData?.shopBanner}
                  onUpload={handleImageUpload}
                  uploading={uploadingField}
                />
                <ImageUploadField
                  label="Shop Photo"
                  field="shopPhoto"
                  currentUrl={sellerData?.shopPhoto}
                  onUpload={handleImageUpload}
                  uploading={uploadingField}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              {saving ? (
                <><Loader size={18} className="animate-spin" /> Saving…</>
              ) : (
                <><Save size={18} /> Save Profile</>
              )}
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};
