import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'VENDOR'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    const isVendorRoute = location.pathname.includes('/vendor');
    return (
      <Navigate
        to={isVendorRoute ? '/vendor/login' : '/admin/login'}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'ADMIN';
    if (!allowedRoles.includes(userRole)) {
      // Vendor attempting to access Admin-only route
      if (userRole === 'VENDOR') {
        return <Navigate to="/vendor-portal" replace />;
      }
      // Admin attempting to access Vendor-only route
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
};
