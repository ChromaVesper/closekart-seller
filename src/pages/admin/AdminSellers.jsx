import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MessageSquare,
  X,
  Loader,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Image as ImageIcon,
  ChevronDown,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { subscribeAllSellers, updateVerificationStatus } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { VERIFICATION_STATUS } from '../../utils/constants';

// ─── Image Preview Modal ────────────────────────────────────────────────────────
const ImageModal = ({ url, label, onClose }) => (
  <div
    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <p className="font-semibold text-gray-900">{label}</p>
        <button onClick={onClose}>
          <X size={20} className="text-gray-500 hover:text-gray-800" />
        </button>
      </div>
      <img src={url} alt={label} className="w-full max-h-96 object-contain bg-gray-50" />
    </div>
  </div>
);

// ─── Seller Detail Modal ────────────────────────────────────────────────────────
const SellerModal = ({ seller, onClose, onAction }) => {
  const [notes, setNotes] = useState(seller.verificationNotes || '');
  const [acting, setActing] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const act = async (status) => {
    setActing(status);
    await onAction(seller.id, status, notes);
    setActing(null);
    onClose();
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <span className="text-gray-500 w-24 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-900">{value || '—'}</span>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{seller.shopName || 'Unnamed Shop'}</h2>
              <p className="text-sm text-gray-500">{seller.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={seller.verificationStatus || 'Pending'} />
              <button onClick={onClose}>
                <X size={20} className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Shop Images */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                Shop Images
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'shopLogo', label: 'Logo' },
                  { key: 'shopBanner', label: 'Banner' },
                  { key: 'shopPhoto', label: 'Photo' },
                ].map(({ key, label }) =>
                  seller[key] ? (
                    <button
                      key={key}
                      onClick={() => setImgPreview({ url: seller[key], label })}
                      className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 transition-all"
                    >
                      <img
                        src={seller[key]}
                        alt={label}
                        className="w-full h-24 object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <Eye size={18} className="text-white" />
                      </div>
                      <p className="text-xs text-center py-1 font-medium text-gray-600">{label}</p>
                    </button>
                  ) : (
                    <div
                      key={key}
                      className="flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400"
                    >
                      <ImageIcon size={20} />
                      <p className="text-xs mt-1">{label}</p>
                      <p className="text-xs text-gray-300">Not uploaded</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</h3>
                <InfoRow icon={Phone} label="Mobile" value={seller.mobile} />
                <InfoRow icon={Mail} label="Email" value={seller.email} />
                <InfoRow icon={MapPin} label="Address" value={seller.address} />
                <InfoRow icon={MapPin} label="City" value={`${seller.city || '—'}, ${seller.state || '—'} - ${seller.pincode || '—'}`} />
              </div>
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Business</h3>
                <InfoRow icon={Store} label="Category" value={seller.category} />
                <InfoRow icon={Navigation} label="Delivery" value={seller.deliveryRadius ? `${seller.deliveryRadius} km` : null} />
                <InfoRow icon={ShieldCheck} label="GST" value={seller.gstNumber} />
                <InfoRow icon={ShieldCheck} label="PAN" value={seller.panNumber} />
                <InfoRow icon={ShieldCheck} label="Aadhaar" value={seller.aadhaarNumber} />
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span>
                <Calendar size={14} className="inline mr-1" />
                Joined:{' '}
                {seller.createdAt?.toDate
                  ? seller.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MessageSquare size={14} className="inline mr-1" />
                Verification Notes (shown to seller if rejected)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes for the seller…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => act(VERIFICATION_STATUS.APPROVED)}
                disabled={!!acting}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {acting === VERIFICATION_STATUS.APPROVED ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Approve Seller
              </button>
              <button
                onClick={() => act(VERIFICATION_STATUS.UNDER_REVIEW)}
                disabled={!!acting}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {acting === VERIFICATION_STATUS.UNDER_REVIEW ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Clock size={16} />
                )}
                Under Review
              </button>
              <button
                onClick={() => act(VERIFICATION_STATUS.REJECTED)}
                disabled={!!acting}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {acting === VERIFICATION_STATUS.REJECTED ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Reject Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {imgPreview && (
        <ImageModal
          url={imgPreview.url}
          label={imgPreview.label}
          onClose={() => setImgPreview(null)}
        />
      )}
    </>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, color }) => (
  <div className={`bg-white rounded-xl border ${color} p-4 flex flex-col`}>
    <span className="text-2xl font-bold text-gray-900">{count}</span>
    <span className="text-sm text-gray-500 mt-1">{label}</span>
  </div>
);

// ─── Main Admin Page ────────────────────────────────────────────────────────────
export const AdminSellers = () => {
  const toast = useToast();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAllSellers((data) => {
      setSellers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAction = useCallback(
    async (uid, status, notes) => {
      try {
        await updateVerificationStatus(uid, status, notes);
        toast.success(`Seller ${status}!`);
      } catch {
        toast.error('Action failed. Please try again.');
      }
    },
    [toast]
  );

  const filtered = sellers.filter((s) => {
    const matchSearch =
      !search ||
      s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'All' || s.verificationStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    All: sellers.length,
    Pending: sellers.filter((s) => s.verificationStatus === 'Pending').length,
    Approved: sellers.filter((s) => s.verificationStatus === 'Approved').length,
    Rejected: sellers.filter((s) => s.verificationStatus === 'Rejected').length,
    'Under Review': sellers.filter((s) => s.verificationStatus === 'Under Review').length,
  };

  const FILTERS = ['All', 'Pending', 'Approved', 'Under Review', 'Rejected'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">CloseKart Seller Verification Panel</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sellers" count={counts.All} color="border-gray-200" />
          <StatCard label="Pending" count={counts.Pending} color="border-yellow-200" />
          <StatCard label="Approved" count={counts.Approved} color="border-green-200" />
          <StatCard label="Rejected" count={counts.Rejected} color="border-red-200" />
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, shop or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    filterStatus === f
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {f} ({counts[f] ?? 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Users size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-semibold">No sellers found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Seller</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">City</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {s.shopLogo ? (
                            <img
                              src={s.shopLogo}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {(s.shopName || s.fullName || '?')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{s.shopName || '—'}</p>
                            <p className="text-gray-400 text-xs">{s.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{s.category || '—'}</td>
                      <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{s.city || '—'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.verificationStatus || 'Pending'} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                        {s.createdAt?.toDate
                          ? s.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedSeller(s)}
                          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-1.5 rounded-lg transition-colors text-sm"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          CloseKart Admin Panel · Showing {filtered.length} of {sellers.length} sellers
        </p>
      </div>

      {/* Seller Detail Modal */}
      {selectedSeller && (
        <SellerModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};
