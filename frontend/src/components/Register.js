import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [listenWakewords, setListenWakewords] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/users/register/', {
            username: username,
            email: email,
            password: password,
            listen_to_wakewords: listenWakewords
        })
            .then(response => {
                setSuccess(true);
                setError('');
                navigate('/login')
            })
            .catch(error => {
                setError('Registration failed. Please check your details.');
            });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Register</Typography>
            {success && <Typography color="primary">Registration successful! You can now log in.</Typography>}
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
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={listenWakewords}
                            onChange={(e) => setListenWakewords(e.target.checked)}
                        />
                    }
                    label="Enable wake word detection by default"
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>Register</Button>
            </form>
        </Container>
    );
};

export default Register;
