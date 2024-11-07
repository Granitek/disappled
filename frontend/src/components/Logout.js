import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();

        // Przekierowanie na stronę logowania
        navigate('/login');
    }, [logout, navigate]);

    return null; // Nie musisz nic renderować, ponieważ to czysto funkcjonalny komponent
};

export default Logout;
