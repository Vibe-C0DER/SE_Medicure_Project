import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children, redirectTo = '/' }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
};

export default PublicRoute;

