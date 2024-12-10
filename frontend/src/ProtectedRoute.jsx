import React from 'react';
import { Navigate } from 'react-router-dom'; // Use Navigate from React Router v6

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Check login status from localStorage

  if (!isLoggedIn) {
    return <Navigate to="/" replace />; // Fixed: Use Navigate instead of Redirect and added replace
  }

  return children; // Render protected content if logged in
};

export default ProtectedRoute;
