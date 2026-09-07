import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
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

  const navItems: NavGroup[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
    },
    {
      name: 'Catalog',
      icon: <Package className="w-4.5 h-4.5" />,
      children: [
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

  const isLinkActive = (path: string) => {
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
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#f3ecfc] border-r border-[#e5d5f8] transition-all duration-300 ease-in-out select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#e5d5f8] bg-[#eedffc]/50">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7e14ff] to-[#47bfff] flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
              <img src="/favicon.svg" alt="KidsPlay" className="w-6 h-6 object-contain" onError={(e) => {
                // Fallback icon if svg not loaded
                (e.target as HTMLElement).style.display = 'none';
              }} />
              <span className="text-white text-base font-extrabold">K</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-tight">KidsPlay</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7e14ff]">
                  {user?.role === 'SHOPKEEPER' ? 'Shopkeeper Portal' : 'Admin Panel'}
                </span>
              </div>
            )}
          </NavLink>

          {/* Close for mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg"
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
                // Collapsed view with tooltip / dropdown trigger
                return (
                  <div key={item.name} className="relative group py-1">
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className={`w-full h-10 rounded-xl flex items-center justify-center transition-colors ${
                        groupActive
                          ? 'bg-[#7e14ff] text-white shadow-xs'
                          : 'text-[#523970] hover:bg-[#eadef8] hover:text-[#2a1348]'
                      }`}
                      title={item.name}
                    >
                      {item.icon}
                    </button>
                  </div>
                );
              }

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      groupActive
                        ? 'text-[#7e14ff] bg-[#eadef8] font-bold'
                        : 'text-[#523970] hover:bg-[#eadef8]/70 hover:text-[#2a1348]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={groupActive ? 'text-[#7e14ff]' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-400">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {/* Submenu */}
                  {isOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-[#dec5f7] ml-5">
                      {item.children.map((sub) => {
                        const active = isLinkActive(sub.path);
                        return (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              active
                                ? 'bg-[#7e14ff] text-white font-semibold shadow-2xs'
                                : 'text-[#5d447d] hover:text-[#2a1348] hover:bg-[#eadef8]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={active ? 'text-white' : 'text-[#7e14ff]'}>
                                {sub.icon}
                              </span>
                              <span>{sub.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {sub.badge !== undefined && (
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                    active
                                      ? 'bg-white/25 text-white'
                                      : 'bg-[#eedffc] text-[#7e14ff] border border-[#dec5f7]'
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              )}
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Standalone Link
            const active = item.path ? isLinkActive(item.path) : false;

            return (
              <NavLink
                key={item.name}
                to={item.path || '#'}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center ${
                  sidebarCollapsed ? 'justify-center h-10 w-full' : 'justify-between px-3 py-2'
                } rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                  active
                    ? 'bg-[#7e14ff] text-white shadow-xs'
                    : 'text-[#523970] hover:bg-[#eadef8] hover:text-[#2a1348]'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-white' : 'text-[#7e14ff]'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </div>

                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white text-[#7e14ff]' : 'bg-[#7e14ff] text-white'}`}>
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
        <div className="p-3 border-t border-[#e5d5f8] hidden lg:flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[#674f85] hover:text-[#2a1348] hover:bg-[#eadef8] transition-colors text-xs font-semibold cursor-pointer"
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
