import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const performLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        performLogout();
    });

    return null; // Komponent czysto funkcjonalny, nic nie renderuje
};

export default Logout;

