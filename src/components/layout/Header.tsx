import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isVendor = user?.role === 'VENDOR';

  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileSidebarOpen,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
  } = useAdmin();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute readable page title from route
  const getPageTitle = () => {
    if (isVendor) {
      if (location.search.includes('tab=products')) return 'My Toy Products';
      if (location.search.includes('tab=add')) return 'Add New Toy Product';
      if (location.search.includes('tab=orders')) return 'My Orders & Customers';
      if (location.search.includes('tab=profile')) return 'My Shop Profile';
      return user?.shopName || 'Shopkeeper Dashboard';
    }

    const path = location.pathname;
    if (path === '/' || path === '/admin' || path === '/admin/dashboard') return 'Super Admin Dashboard';
    if (path.includes('/approvals')) return 'Product Approvals Queue';
    if (path.includes('/products/new')) return 'Add New Product';
    if (path.includes('/products/best-sellers')) return 'Best Sellers Catalog';
    if (path.includes('/products/new-arrivals')) return 'New Arrivals Catalog';
    if (path.includes('/products') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/products')) return 'Products Management';
    if (path.includes('/categories')) return 'Categories Management';
    if (path.includes('/attributes')) return 'Product Attributes';
    if (path.includes('/variants')) return 'Product Variants';
    if (path.includes('/inventory')) return 'Global Inventory';
    if (path.includes('/orders')) return 'Platform Orders';
    if (path.includes('/vendors')) return 'Vendors Management';
    if (path.includes('/customers')) return 'Customers';
    if (path.includes('/banners')) return 'Marketing Banners';
    if (path.includes('/collections')) return 'Collections';
    if (path.includes('/coupons')) return 'Coupons & Discounts';
    if (path.includes('/homepage')) return 'Homepage CMS';
    if (path.includes('/media')) return 'Media Library';
    if (path.includes('/reviews')) return 'Customer Reviews';
    if (path.includes('/settings')) return 'Store Settings';
    return 'Admin Panel';
  };

  return (
    <header className={`h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs border-b ${
      isVendor ? 'bg-[#fffaf0] border-amber-200' : 'bg-[#fff0f7] border-[#ffd4ea]'
    }`}>
      {/* Left section: Hamburger / Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-[#733557] hover:text-[#451630] hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse indicator button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-2 text-[#733557] hover:text-[#451630] hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            {isVendor && <Store className="w-4 h-4 text-amber-600 hidden sm:inline" />}
            <span>{getPageTitle()}</span>
          </h1>
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-500">
            {isVendor
              ? `Shopkeeper Partner Portal • ${user?.shopName || 'Toy Store'}`
              : 'KidsPlay Store Administration'}
          </span>
        </div>
      </div>

      {/* Right section: Search, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global search input */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isVendor ? "Search my toys, orders..." : "Search catalog, orders, SKUs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-2xs"
          />
        </div>

        {/* View Storefront Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-pink-600 bg-white border border-pink-200 hover:bg-pink-50 transition-all shadow-2xs"
          title="Open Live Customer Storefront (localhost:3000)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Store</span>
        </a>

        {/* Notifications Dropdown (Admin only) */}
        {!isVendor && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-[#733557] hover:text-[#451630] hover:bg-[#ffe0f1] relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white" />
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-92 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] font-semibold text-[#ff91db] hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 text-xs text-slate-700">
                      <div className="font-bold">{n.title}</div>
                      <div className="text-slate-400 text-[10px]">{n.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Separator */}
        <div className="h-6 w-px bg-slate-300 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-xs shadow-xs uppercase ${
              isVendor ? 'bg-gradient-to-tr from-amber-500 to-rose-500' : 'bg-gradient-to-tr from-[#ff91db] to-[#ffa3e4]'
            }`}>
              {user?.name ? user.name.charAt(0) : (isVendor ? 'S' : 'A')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || (isVendor ? 'Shopkeeper' : 'Admin')}
              </span>
              <span className={`text-[10px] font-bold leading-tight ${
                isVendor ? 'text-amber-700' : 'text-[#9c537b]'
              }`}>
                {isVendor ? (user?.shopName || 'Shopkeeper') : 'Administrator'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black text-slate-900 truncate">{user?.name || (isVendor ? 'Shopkeeper' : 'Admin')}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    isVendor ? 'bg-amber-100 text-amber-800' : 'bg-[#ffe3f5] text-[#ff91db]'
                  }`}>
                    {isVendor ? 'SHOPKEEPER' : 'SUPER ADMIN'}
                  </span>
                </div>
                {isVendor && user?.shopName && (
                  <p className="text-[11px] font-bold text-amber-700 truncate">{user.shopName}</p>
                )}
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>

              {isVendor ? (
                <button
                  onClick={() => {
                    navigate('/vendor-portal?tab=profile');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-amber-50 flex items-center gap-2.5 cursor-pointer font-bold"
                >
                  <Store className="w-4 h-4 text-amber-500" />
                  <span>My Shop Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-bold"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Store Settings</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  const wasVendor = user?.role === 'VENDOR';
                  logout();
                  setProfileOpen(false);
                  showToast('You have been logged out safely.', 'info');
                  navigate(wasVendor ? '/vendor/login' : '/admin/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-bold"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
