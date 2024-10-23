// src/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/token/', {
            username: username,
            password: password
        })
            .then((response) => {
                // Zapisz token JWT w localStorage lub state, tutaj użyjemy localStorage
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                // Opcjonalnie, można ustawić użytkownika, jeśli API zwraca dodatkowe informacje o użytkowniku
                setUser(username); // Przechowuje tylko nazwę użytkownika

                // Przekierowanie na stronę z postami
                navigate('/Posts');
            })
            .catch((error) => {
                setError('Login failed. Please check your credentials.');
            });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>Login</Button>
            </form>
        </Container>
    );
};

export default Login;
