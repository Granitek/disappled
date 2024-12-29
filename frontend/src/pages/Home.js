import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Posts from '../components/Posts';
import WakeWords from '../components/WakeWords';
import { useFontSize } from '../components/FontSizeContext';

const Home = () => {
    const { applyFontSize, applyReducedFontSize } = useFontSize();

    return (
        <>
            <WakeWords />
            <Typography style={{ textAlign: 'center', fontSize: applyFontSize() }}>
                Welcome to a page dedicated to people who have difficulties using or administering typical websites.
            </Typography>
            <Typography style={{ textAlign: 'center', fontSize: applyReducedFontSize() }}>
                If you want a previously recorded audio file transcribed into text, click on the 'Leopard' tab in the navigation menu or {' '}
                <Link to='/Leopard'>click here</Link>.
            </Typography>
            <Posts></Posts>
        </>
    );
};

export default Home;
