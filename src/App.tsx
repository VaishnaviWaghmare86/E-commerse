import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, Users, Settings, Tag } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tag size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white">KidsPlay Admin</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-sky-500 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        {[
          { title: 'Total Sales', value: '$12,450', color: 'bg-green-50 text-green-600 border-green-200' },
          { title: 'Active Orders', value: '45', color: 'bg-sky-50 text-sky-600 border-sky-200' },
          { title: 'Total Products', value: '120', color: 'bg-pink-50 text-pink-600 border-pink-200' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-xl border ${stat.color}`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="text-slate-500 text-sm py-10 text-center border-2 border-dashed border-slate-200 rounded-lg">
          Connect Backend to load activity...
        </div>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <div className="text-sm text-slate-500">Welcome back, Admin</div>
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">A</div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import Categories from './pages/Categories';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<div className="text-2xl font-bold">Products Management (Coming Soon)</div>} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
