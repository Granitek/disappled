// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

// // Stwórz kontekst
// const AuthContext = createContext();

// // Provider kontekstu, który udostępnia stan i funkcje uwierzytelniania
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     // Funkcja do weryfikacji tokenu
//     const validateToken = async (token) => {
//         try {
//             const response = await axios.get('http://localhost:8000/users/profile/', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             return response.data.user ? response.data.user : null;
//         } catch {
//             return null;
//         }
//     };

//     // Sprawdź token przy załadowaniu aplikacji
//     useEffect(() => {
//         const savedToken = localStorage.getItem('access_token');

//         const verifyUser = async () => {
//             if (savedToken) {
//                 const userData = await validateToken(savedToken);

//                 if (userData) {
//                     setUser({ ...userData, token: savedToken });
//                 } else {
//                     localStorage.removeItem('access_token');
//                     setUser(null);
//                 }
//             }
//             setIsLoading(false);
//         };

//         verifyUser();
//     }, []);

//     // Funkcja logowania
//     const login = (userData, token) => {
//         localStorage.setItem('access_token', token);
//         setUser({ ...userData, token });
//     };

//     // Funkcja wylogowania
//     const logout = () => {
//         localStorage.removeItem('access_token');
//         setUser(null);
//     };

//     // Udostępnij stan i funkcje w kontekście
//     return (
//         // <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//         //     {children}
//         // </AuthContext.Provider>
//         <AuthContext.Provider value={{ user, isLoading, login, logout, token: user?.token }}>
//             {!isLoading && children}
//         </AuthContext.Provider>
//     );
// };

// // Hook do dostępu do AuthContext
// export const useAuth = () => {
//     return useContext(AuthContext);
// };

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../components/axiosConfig.js'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Pobierz dane użytkownika
    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/users/profile/');
            console.log('Fetched user:', response.data.user); // Debugowanie
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Sprawdź sesję przy załadowaniu aplikacji
    useEffect(() => {
        fetchUser();
    }, []);

    // Logowanie
    const login = async (username, password) => {
        try {
            const response = await axios.post('/users/login/', { username, password });
            console.log('login response', response.data.username)
            await fetchUser(); // Odśwież dane użytkownika
            // setUser(response.data.user)
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    };

    // Wylogowanie
    const logout = async () => {
        try {
            await axios.post('/users/logout/'); // Endpoint do wylogowania
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error.response?.data || error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
