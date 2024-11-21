// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const Logout = () => {
//     const { logout } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         logout();

//         // Przekierowanie na stronę logowania
//         navigate('/login');
//     }, [logout, navigate]);

//     return null; // Nie musisz nic renderować, ponieważ to czysto funkcjonalny komponent
// };

// export default Logout;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await axios.post('/users/logout/');
                logout();
                navigate('/login');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return null; // Komponent czysto funkcjonalny, nic nie renderuje
};

export default Logout;

