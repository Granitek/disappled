import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Stwórz kontekst
const AuthContext = createContext();

// Provider kontekstu, który udostępnia stan i funkcje uwierzytelniania
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Funkcja do weryfikacji tokenu
    const validateToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/users/profile/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data.user ? response.data.user : null;
        } catch {
            return null;
        }
    };

    // Sprawdź token przy załadowaniu aplikacji
    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');

        const verifyUser = async () => {
            if (savedToken) {
                const userData = await validateToken(savedToken);

                if (userData) {
                    setUser({ ...userData, token: savedToken });
                } else {
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        verifyUser();
    }, []);

    // Funkcja logowania
    const login = (userData, token) => {
        localStorage.setItem('access_token', token);
        setUser({ ...userData, token });
    };

    // Funkcja wylogowania
    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    // Udostępnij stan i funkcje w kontekście
    return (
        // <AuthContext.Provider value={{ user, isLoading, login, logout }}>
        //     {children}
        // </AuthContext.Provider>
        <AuthContext.Provider value={{ user, isLoading, login, logout, token: user?.token }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// Hook do dostępu do AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};