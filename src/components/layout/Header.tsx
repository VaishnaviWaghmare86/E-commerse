import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Package,
  ShoppingCart,
  CheckCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileSidebarOpen,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    clearAllNotifications,
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
    const path = location.pathname;
    if (path === '/' || path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path.includes('/products/new')) return 'Add New Product';
    if (path.includes('/products') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/products')) return 'Products Management';
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/attributes')) return 'Attributes';
    if (path.includes('/variants')) return 'Product Variants';
    if (path.includes('/inventory')) return 'Inventory Management';
    if (path.includes('/orders')) return 'Orders';
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
        );
      case 'stock':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'customer':
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
    }
  };


  return (
    <header className="h-16 bg-[#f3ecfc] border-b border-[#e5d5f8] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left section: Hamburger / Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-[#523970] hover:text-[#2a1348] hover:bg-[#eadef8] rounded-lg transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse indicator button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-2 text-[#523970] hover:text-[#2a1348] hover:bg-[#eadef8] rounded-lg transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-[#2a1348] tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          <span className="hidden sm:inline text-[11px] text-[#715494] font-medium">
            KidsPlay Store Administration
          </span>
        </div>
      </div>

      {/* Right section: Search, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global search input */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog, orders, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/90 border border-[#dec5f7] rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7e14ff] focus:ring-1 focus:ring-[#7e14ff]/30 focus:bg-white transition-all shadow-2xs"
          />
          <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-[#6e5391] bg-[#eedffc] border border-[#dec5f7] rounded shadow-2xs">
            /
          </kbd>
        </div>

        {/* View Storefront Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7e14ff] bg-white border border-[#dec5f7] hover:bg-[#eedffc] hover:border-[#7e14ff] transition-all shadow-2xs"
          title="Open Live Customer Storefront (localhost:3000)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Store</span>
        </a>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-[#523970] hover:text-[#2a1348] hover:bg-[#eadef8] relative transition-colors cursor-pointer"
            aria-label="Notifications"
            title={unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread notification${unreadNotificationsCount > 1 ? 's' : ''}` : 'Notifications'}
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
              {/* Dropdown Header */}
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#eedffc] text-[#7e14ff] px-2 py-0.5 rounded-full">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        markAllNotificationsAsRead();
                        showToast('All notifications marked as read', 'success');
                      }}
                      className="text-[11px] font-semibold text-[#7e14ff] hover:text-[#6a0ed9] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all as read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        clearAllNotifications();
                        showToast('All notifications cleared', 'info');
                      }}
                      className="text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Clear / Ignore all notifications"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      No notifications or alerts to review
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) {
                          navigate(n.link);
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group relative ${
                        n.unread ? 'bg-violet-50/40' : 'bg-white opacity-85 hover:opacity-100'
                      }`}
                    >
                      {getNotificationIcon(n.type)}

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs truncate ${n.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>

                      {/* Quick action buttons: Mark read & Ignore/Dismiss */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {n.unread && (
                          <button
                            type="button"
                            title="Mark as read"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationAsRead(n.id);
                              showToast('Marked as read', 'info');
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-[#7e14ff] hover:bg-[#eedffc] transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Ignore / Dismiss"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.id);
                            showToast('Notification ignored', 'info');
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Unread indicator dot */}
                      {n.unread && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#7e14ff]" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    navigate('/admin/orders');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs font-medium text-[#7e14ff] hover:text-[#6a0ed9] py-1 block w-full cursor-pointer"
                >
                  View All Orders & Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#dec5f7] hidden sm:block" />

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#eadef8] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7e14ff] to-[#47bfff] text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#2a1348] leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#715494] leading-tight">
                {user?.role === 'ADMIN' ? 'Super Admin' : 'Shopkeeper'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#715494] hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Admin'}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                    user?.role === 'ADMIN'
                      ? 'bg-purple-100 text-[#7e14ff]'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role || 'ADMIN'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@kidsplaystore.com'}</p>
                {user?.storeName && (
                  <p className="text-[10px] text-violet-600 font-medium truncate mt-0.5">
                    🏬 {user.storeName}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  navigate('/admin/settings');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Profile Details</span>
              </button>

              <button
                onClick={() => {
                  navigate('/admin/settings');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Store Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  showToast('You have been logged out safely.', 'info');
                  navigate('/admin/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
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
