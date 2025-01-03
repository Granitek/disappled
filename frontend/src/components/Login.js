import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/profile');
        } catch (error) {
            // setError('Login failed. Please check your credentials.');
            setError(error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Login
                    </Typography>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 2,
                                py: 1.2,
                                fontSize: "1rem",
                                textTransform: "none",
                                boxShadow: 2,
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Register here
                            </Link>
                            .
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};
export default Login;
