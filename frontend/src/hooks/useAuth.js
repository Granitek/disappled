import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../components/axiosConfig.js'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pobierz dane użytkownika
    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/users/profile/');
            // console.log('Fetched user:', response.data.user); // Debugowanie
            setUser(response.data.user);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            setUser(null);
            setPosts([]);
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
            setIsLoading(true)
            await axios.post('/users/logout/'); // Endpoint do wylogowania
            setUser(null);
            setPosts([]);
        } catch (error) {
            console.error('Logout error:', error.response?.data || error.message);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <AuthContext.Provider value={{ user, posts, isLoading, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
