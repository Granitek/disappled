import React, { useState } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Divider, CardContent, Button } from '@mui/material';
import UploadButton from '../components/UploadButton';
import { useFontSize } from '../hooks/useFontSize';

const Leopard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [transcript, setTranscript] = useState('');
    const { applyFontSize, applyReducedFontSize } = useFontSize();
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('audioFile', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/Leopard/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setTranscript(response.data.transcript);
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography style={{ textAlign: 'center', fontSize: applyFontSize() }}>
                    Przekształć audio na tekst
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <UploadButton handleFileChange={handleFileChange} />
                    <Button onClick={handleUpload} style={{ fontSize: applyReducedFontSize() }}>Prześlij audio</Button>
                </Box>
                <Divider />
                <Typography style={{ textAlign: 'center', fontSize: applyFontSize() }}>
                    Przekonwertowany tekst:
                </Typography>
                <Typography style={{ textAlign: 'center', fontSize: applyReducedFontSize() }}>
                    {transcript}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Leopard;
