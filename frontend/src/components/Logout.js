// src/Logout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Usuń tokeny JWT z localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Wyczyszczenie użytkownika
        setUser(null);

        // Przekierowanie na stronę logowania
        navigate('/login');
    }, [setUser, navigate]);

    return null; // Nie musisz nic renderować, ponieważ to czysto funkcjonalny komponent
};

export default Logout;
