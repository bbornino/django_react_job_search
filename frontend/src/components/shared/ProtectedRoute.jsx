import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = useIsAuthenticated();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the passed-in element
  return element;
};

export default ProtectedRoute;
