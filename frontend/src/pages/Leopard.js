import React, { useState } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Divider, CardContent, Button } from '@mui/material';
import UploadButton from '../components/UploadButton';
import { useFontSize } from '../hooks/useFontSize';
import WakeWords from '../components/WakeWords';
import Instructions from '../components/Instruction';

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
        <><WakeWords />
            <Instructions />
            <Card
                variant="outlined"
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    my: 4,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: applyFontSize(),
                            mb: 2,
                        }}
                    >
                        Przekształć audio na tekst
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            my: 3,
                        }}
                    >
                        <UploadButton handleFileChange={handleFileChange} />
                        <Button
                            id="transcribe-btn"
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            sx={{ fontSize: applyReducedFontSize() }}
                        >
                            Prześlij audio
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: 'center',
                            fontSize: applyFontSize(),
                            mb: 2,
                        }}
                    >
                        Przekonwertowany tekst:
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            fontSize: applyReducedFontSize(),
                            color: 'text.secondary',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {transcript || 'Brak tekstu do wyświetlenia.'}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default Leopard;
