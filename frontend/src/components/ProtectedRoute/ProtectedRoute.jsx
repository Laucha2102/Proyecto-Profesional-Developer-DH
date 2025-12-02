import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, esAdmin } = useAuth();

    if (isAuthenticated && esAdmin()) {
        return <Outlet />;
    }

    if (isAuthenticated && !esAdmin()) {
        return <Navigate to="/" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;