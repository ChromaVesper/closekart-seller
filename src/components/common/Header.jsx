import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { sellerData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/seller-login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CK</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">CloseKart</h1>
                <p className="text-xs text-gray-500">Seller Panel</p>
              </div>
            </div>
          </div>

          {/* Right Side - User Info and Logout */}
          <div className="flex items-center gap-4">
            {/* Shop Info */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {sellerData?.shopName || 'My Shop'}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {sellerData?.email}
              </p>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-white text-sm font-semibold">
                {sellerData?.shopName?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
