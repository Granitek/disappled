import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
