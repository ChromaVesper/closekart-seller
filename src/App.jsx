import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

// Auth Pages
import { SellerLogin } from './pages/auth/SellerLogin';
import { SellerSignup } from './pages/auth/SellerSignup';

// Dashboard Pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { Products } from './pages/products/Products';
import { Orders } from './pages/orders/Orders';
import { Analytics } from './pages/analytics/Analytics';
import { Settings } from './pages/settings/Settings';
import { Reels } from './pages/reels/Reels';
import { Documentation } from './pages/documentation/Documentation';

// Verification System Pages
import { SellerProfile } from './pages/profile/SellerProfile';
import { AdminSellers } from './pages/admin/AdminSellers';

// Styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller-signup" element={<SellerSignup />} />

            {/* Protected Seller Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><SellerProfile /></ProtectedRoute>}
            />
            <Route
              path="/products"
              element={<ProtectedRoute><Products /></ProtectedRoute>}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute><Orders /></ProtectedRoute>}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute><Analytics /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route
              path="/reels"
              element={<ProtectedRoute><Reels /></ProtectedRoute>}
            />
            <Route
              path="/documentation"
              element={<ProtectedRoute><Documentation /></ProtectedRoute>}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/sellers"
              element={<AdminRoute><AdminSellers /></AdminRoute>}
            />

            {/* Default + Catch-all */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
