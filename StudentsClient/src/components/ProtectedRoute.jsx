import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken'); // Check if user is authenticated
    // Optionally, you can also verify the user's role here

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;