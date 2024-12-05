import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading)
        return <CircularProgress />;

    return user ? children : <Navigate to="/Login" />;
};

export default ProtectedRoute;
