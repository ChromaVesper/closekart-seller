import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Loader, ShieldOff } from 'lucide-react';

/**
 * AdminRoute — production-safe admin route guard.
 *
 * Flow:
 *  1. While auth is loading → show spinner (prevents flash-of-redirect on refresh)
 *  2. Not authenticated → redirect to /seller-login
 *  3. Admin status still loading → show spinner
 *  4. Authenticated but NOT admin → toast error + redirect to /dashboard
 *  5. Admin → render children
 */
export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading, adminLoading } = useAuth();
  const toast = useToast();
  const location = useLocation();

  // Fire the toast exactly once when access is denied
  const isDenied = !loading && !adminLoading && user && !isAdmin;

  useEffect(() => {
    if (isDenied) {
      toast.error('Unauthorized admin access');
    }
  }, [isDenied]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth not yet resolved (e.g. page refresh) ─────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Checking authentication…</p>
      </div>
    );
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/seller-login" state={{ from: location }} replace />;
  }

  // ── Admin status still resolving ──────────────────────────────────────────
  if (adminLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Verifying admin privileges…</p>
      </div>
    );
  }

  // ── Authenticated but not admin ────────────────────────────────────────────
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── Admin access granted ───────────────────────────────────────────────────
  return children;
};
