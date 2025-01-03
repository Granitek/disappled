import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user } = useAuth();
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        My App
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/Leopard">
                        Leopard
                    </Button>
                    <Button color="inherit" component={Link} to="/profile">
                        Your profile
                    </Button>
                    {user ?
                        (<Button color="inherit" component={Link} to="/logout">Logout</Button>) :
                        (<Button color="inherit" component={Link} to="/login" >Login</Button>)
                    }
                </Toolbar>
            </Container>
        </AppBar >
    );
};

export default Navbar;
