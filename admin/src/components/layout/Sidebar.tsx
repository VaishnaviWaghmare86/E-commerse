import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Store,
  Building2,
  Package,
  FolderTree,
  SlidersHorizontal,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Sparkles,
  TicketPercent,
  LayoutTemplate,
  Images,
  Star,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Flame,
  PackagePlus,
  UserCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

interface NavSubItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroup {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavSubItem[];
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isVendor = user?.role === 'VENDOR';

  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    orders,
    reviews,
    products,
  } = useAdmin();

  // Keep track of which menu groups are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Catalog: true,
    Marketing: false,
    Content: false,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;
  const bestSellersCount = products.filter((p) => p.isBestSeller).length;
  const newArrivalsCount = products.filter((p) => p.isNewArrival).length;

  // 🏬 SHOPKEEPER ONLY NAVIGATION
  const vendorNavItems: NavGroup[] = [
    {
      name: 'Shop Dashboard',
      path: '/vendor-portal',
      icon: <Store className="w-4.5 h-4.5 text-amber-500" />,
    },
    {
      name: 'My Products',
      path: '/vendor-portal?tab=products',
      icon: <Package className="w-4.5 h-4.5 text-sky-500" />,
    },
    {
      name: 'Add New Toy',
      path: '/vendor-portal?tab=add',
      icon: <PackagePlus className="w-4.5 h-4.5 text-rose-500" />,
      badge: 'Upload Photo',
    },
    {
      name: 'My Orders & Customers',
      path: '/vendor-portal?tab=orders',
      icon: <ShoppingCart className="w-4.5 h-4.5 text-emerald-500" />,
    },
    {
      name: 'Shop Profile',
      path: '/vendor-portal?tab=profile',
      icon: <UserCheck className="w-4.5 h-4.5 text-pink-500" />,
    },
  ];

  // 🛡️ SUPER ADMIN ONLY NAVIGATION (No Vendor Portal here!)
  const adminNavItems: NavGroup[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
    },
    {
      name: 'Catalog',
      icon: <Package className="w-4.5 h-4.5" />,
      children: [
        {
          name: 'Product Approvals',
          path: '/admin/approvals',
          icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
          badge: 'Review',
        },
        { name: 'Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
        {
          name: 'Best Sellers',
          path: '/admin/products/best-sellers',
          icon: <Flame className="w-4 h-4 text-amber-500" />,
          badge: bestSellersCount,
        },
        {
          name: 'New Arrivals',
          path: '/admin/products/new-arrivals',
          icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
          badge: newArrivalsCount,
        },
        { name: 'Categories', path: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
        { name: 'Attributes', path: '/admin/attributes', icon: <SlidersHorizontal className="w-4 h-4" /> },
        { name: 'Variants', path: '/admin/variants', icon: <Layers className="w-4 h-4" /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
      ],
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart className="w-4.5 h-4.5" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      name: 'Vendors',
      path: '/admin/vendors',
      icon: <Building2 className="w-4.5 h-4.5 text-sky-500" />,
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: <Users className="w-4.5 h-4.5" />,
    },
    {
      name: 'Marketing',
      icon: <Sparkles className="w-4.5 h-4.5" />,
      children: [
        { name: 'Banners', path: '/admin/banners', icon: <ImageIcon className="w-4 h-4" /> },
        { name: 'Collections', path: '/admin/collections', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Coupons', path: '/admin/coupons', icon: <TicketPercent className="w-4 h-4" /> },
      ],
    },
    {
      name: 'Content',
      icon: <LayoutTemplate className="w-4.5 h-4.5" />,
      children: [
        { name: 'Homepage', path: '/admin/homepage', icon: <LayoutTemplate className="w-4 h-4" /> },
        { name: 'Media Library', path: '/admin/media', icon: <Images className="w-4 h-4" /> },
      ],
    },
    {
      name: 'Reviews',
      path: '/admin/reviews',
      icon: <Star className="w-4.5 h-4.5" />,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="w-4.5 h-4.5" />,
    },
  ];

  const navItems = isVendor ? vendorNavItems : adminNavItems;

  const isLinkActive = (path: string) => {
    if (isVendor) {
      if (path.includes('?tab=')) {
        const tabVal = path.split('?tab=')[1];
        return location.pathname === '/vendor-portal' && location.search.includes(`tab=${tabVal}`);
      }
      if (path === '/vendor-portal') {
        return location.pathname === '/vendor-portal' && (!location.search || location.search === '' || location.search === '?tab=products');
      }
    }
    if (path === '/admin/dashboard' && (location.pathname === '/' || location.pathname === '/admin' || location.pathname === '/admin/dashboard')) {
      return true;
    }
    if (path === '/admin/products') {
      return location.pathname === '/admin/products' || location.pathname === '/products';
    }
    return location.pathname === path;
  };

  const isGroupActive = (children?: NavSubItem[]) => {
    if (!children) return false;
    return children.some((c) => isLinkActive(c.path));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col ${
          isVendor ? 'bg-[#fffaf0] border-r border-amber-200' : 'bg-[#fff0f7] border-r border-slate-200'
        } transition-all duration-300 ease-in-out select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand section */}
        <div className={`h-16 flex items-center justify-between px-5 border-b ${
          isVendor ? 'border-amber-200 bg-amber-50/80' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <NavLink to={isVendor ? "/vendor-portal" : "/admin/dashboard"} className="flex items-center gap-3 overflow-hidden">
            {isVendor ? (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                <span className="text-white text-base font-extrabold">K</span>
              </div>
            )}
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-tight truncate max-w-[145px]">
                  {isVendor ? (user?.shopName || 'Toy Shop') : 'KidsPlay'}
                </span>
                <span className={`text-[9px] uppercase font-black tracking-widest ${
                  isVendor ? 'text-amber-700' : 'text-indigo-600'
                }`}>
                  {isVendor ? 'Shopkeeper Portal' : 'Admin Panel'}
                </span>
              </div>
            )}
          </NavLink>

          {/* Close for mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            if (item.children) {
              const groupActive = isGroupActive(item.children);
              const isOpen = openGroups[item.name] || groupActive;

              if (sidebarCollapsed) {
                // Collapsed view with tooltip
                return (
                  <div key={item.name} className="relative group py-1">
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className={`w-full h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        groupActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                      title={item.name}
                    >
                      {item.icon}
                    </button>
                  </div>
                );
              }

              // Expanded group
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      groupActive
                        ? 'text-indigo-950 bg-indigo-50/80 font-black'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={groupActive ? 'text-indigo-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pl-6 pr-1 space-y-1 border-l-2 border-indigo-100 ml-4 my-1">
                      {item.children.map((sub) => {
                        const active = isLinkActive(sub.path);
                        return (
                          <NavLink
                            key={sub.name}
                            to={sub.path}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all relative ${
                              active
                                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={active ? 'text-white' : 'text-slate-400'}>
                                {sub.icon}
                              </span>
                              <span>{sub.name}</span>
                            </div>
                            {sub.badge !== undefined && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  active ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Single item (no children)
            const active = isLinkActive(item.path || '');
            return (
              <NavLink
                key={item.name}
                to={item.path || '#'}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  active
                    ? isVendor
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : isVendor
                    ? 'text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-semibold'
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-white' : isVendor ? 'text-amber-600' : 'text-indigo-600'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </div>

                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : isVendor
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {active && !sidebarCollapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer / Collapse toggle button */}
        <div className={`p-3 border-t hidden lg:flex items-center justify-between ${
          isVendor ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors text-xs font-semibold cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4.5 h-4.5" />
            ) : (
              <>
                <PanelLeftClose className="w-4.5 h-4.5" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
