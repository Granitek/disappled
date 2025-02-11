import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel, Card, CardContent, Box } from '@mui/material';
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

        console.log({
            username: username,
            email: email,
            password: password,
            listen_to_wakewords: listenWakewords  // Zawiera stan listenWakewords
        });

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
                setError('Registration failed. Make sure your e-mail is correct.');
            });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Register
                    </Typography>
                    {success && (
                        <Typography color="primary" align="center" sx={{ mb: 2 }}>
                            Registration successful! You can now log in.
                        </Typography>
                    )}
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
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
                            sx={{ mt: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.2,
                                fontSize: "1rem",
                                textTransform: "none",
                                boxShadow: 2,
                            }}
                        >
                            Register
                        </Button>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Log in here
                            </a>
                            .
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
