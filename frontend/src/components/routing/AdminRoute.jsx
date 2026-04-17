import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminRoute;
