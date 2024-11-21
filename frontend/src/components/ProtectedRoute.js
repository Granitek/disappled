import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>;
    }
    console.log('ProtectedRoute user:', user); // Debugowanie
    // console.log(user)
    return user ? children : <Navigate to="/Login" />;
};

export default ProtectedRoute;
