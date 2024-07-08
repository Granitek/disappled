import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <Typography variant="h4" style={{ textAlign: 'center' }}>
                Welcome to a page dedicated to people who have difficulties using or administering typical websites.
            </Typography>
            <Typography variant='h5'>
                If you want a previously recorded audio file transcribed into text, click on the 'Leopard' tab in the navigation menu or {' '}
                <Link to='/Leopard'>click here</Link>.
            </Typography>
        </>
    );
};

export default Home;
