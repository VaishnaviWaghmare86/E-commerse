import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ProductForm } from './pages/ProductForm';
import { Categories } from './pages/Categories';
import { Attributes } from './pages/Attributes';
import { Variants } from './pages/Variants';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Banners } from './pages/Banners';
import { Collections } from './pages/Collections';
import { Coupons } from './pages/Coupons';
import { HomepageCMS } from './pages/HomepageCMS';
import { MediaLibrary } from './pages/MediaLibrary';
import { Reviews } from './pages/Reviews';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AdminProvider>
            <Routes>
              {/* Public Authentication Screens */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Administration Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  {/* Dashboard routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Catalog routes */}
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/admin/products/best-sellers" element={<Products />} />
                  <Route path="/products/best-sellers" element={<Products />} />
                  <Route path="/admin/products/new-arrivals" element={<Products />} />
                  <Route path="/products/new-arrivals" element={<Products />} />
                  <Route path="/admin/products/new" element={<ProductForm />} />
                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/admin/products/:id/edit" element={<ProductForm />} />
                  <Route path="/products/:id/edit" element={<ProductForm />} />

                  <Route path="/admin/categories" element={<Categories />} />
                  <Route path="/categories" element={<Categories />} />

                  <Route path="/admin/attributes" element={<Attributes />} />
                  <Route path="/attributes" element={<Attributes />} />

                  <Route path="/admin/variants" element={<Variants />} />
                  <Route path="/variants" element={<Variants />} />

                  <Route path="/admin/inventory" element={<Inventory />} />
                  <Route path="/inventory" element={<Inventory />} />

                  {/* Orders routes */}
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/admin/orders/:id" element={<Orders />} />

                  {/* Customers routes */}
                  <Route path="/admin/customers" element={<Customers />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/admin/customers/:id" element={<Customers />} />

                  {/* Marketing routes */}
                  <Route path="/admin/banners" element={<Banners />} />
                  <Route path="/banners" element={<Banners />} />
                  <Route path="/admin/collections" element={<Collections />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/admin/coupons" element={<Coupons />} />
                  <Route path="/coupons" element={<Coupons />} />

                  {/* Content CMS routes */}
                  <Route path="/admin/homepage" element={<HomepageCMS />} />
                  <Route path="/homepage" element={<HomepageCMS />} />
                  <Route path="/admin/media" element={<MediaLibrary />} />
                  <Route path="/media" element={<MediaLibrary />} />

                  {/* Reviews routes */}
                  <Route path="/admin/reviews" element={<Reviews />} />
                  <Route path="/reviews" element={<Reviews />} />

                  {/* Settings route */}
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Fallback for invalid path inside admin */}
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>
          </AdminProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
