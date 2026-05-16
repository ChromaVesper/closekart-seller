import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  PlayCircle,
  ChevronRight,
  BookOpen,
  UserCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { STATUS_CONFIG } from '../../utils/constants';

const navItems = [
  { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { path: '/profile', icon: UserCircle, label: 'My Profile' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/reels', icon: PlayCircle, label: 'Upload Reel' },
  { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/documentation', icon: BookOpen, label: 'Documentation' },
];

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { sellerData } = useAuth();
  const status = sellerData?.verificationStatus || 'Pending';
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none z-40 pt-20 lg:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={18} />}
              </Link>
            );
          })}

          {/* Admin link — divider */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              to="/admin/sellers"
              onClick={closeSidebar}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} />
                <span className="text-sm">Admin Panel</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* Bottom — verification status */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className={`rounded-lg p-3 text-center border ${statusCfg.bg} ${statusCfg.border}`}>
            <p className={`text-xs font-semibold ${statusCfg.color} mb-0.5`}>Verification</p>
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              <p className={`text-xs font-medium ${statusCfg.color}`}>{status}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
