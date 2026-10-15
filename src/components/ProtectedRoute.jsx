
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { normalizeRole } from '../services/authService';


export default function ProtectedRoute({
  children,
  allowedRoles = [],
  loginPath = '/login',
  fallbackPath = '/',
}) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    );
  }

  const permitted = allowedRoles.map(normalizeRole);

  if (
    permitted.length > 0 &&
    !permitted.includes(normalizeRole(user?.role))
  ) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children || <Outlet />;
}
