import React from 'react';
import Navbar from './Navbar';
import { Container } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '2rem' }}>
                {children}
            </Container>
        </>
    );
};

export default Layout;
