import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../components/axiosConfig'

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState('Medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFontSize = async () => {
            try {
                const response = await axios.get('/users/profile/');
                setFontSize(response.data.user.profile.font_size);
            } catch (error) {
                console.error('Error fetching font size:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFontSize();
    }, []);

    const updateFontSize = async (newFontSize) => {
        try {
            await axios.put('/users/profile/', { font_size: newFontSize });
            setFontSize(newFontSize);
        } catch (error) {
            console.error('Error updating font size:', error);
        }
    };

    const applyFontSize = () => {
        switch (fontSize) {
            case 'Small': return '14px';
            case 'Large': return '40px';
            default: return '20px';
        }
    };

    const applyReducedFontSize = () => {
        switch (fontSize) {
            case 'Small': return '12px';
            case 'Large': return '30px';
            default: return '16px';
        }
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, setFontSize: updateFontSize, applyFontSize, applyReducedFontSize }}>
            {!loading && children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => useContext(FontSizeContext);
