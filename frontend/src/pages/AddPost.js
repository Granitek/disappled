import React, { useState } from 'react';
import axios from '../components/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import UploadButton from '../components/UploadButton';
import WakeWords from '../components/WakeWords';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useFontSize } from '../hooks/useFontSize';
import Instructions from '../components/Instruction';

const AddPost = ({ onPostAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const navigate = useNavigate();
    const [transcribing, setTranscribing] = useState(false);
    const [image, setImage] = useState(null);
    const [imageView, setImageView] = useState(null);
    const { applyReducedFontSize } = useFontSize();

    const { startRecognition } = useSpeechRecognition();

    const handleFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);

            const reader = new FileReader();
            reader.onload = () => {
                setImageView(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setImage(null);
            setImageView(null);
        }
    };

    const handleTranscription = async () => {
        if (!audioFile) return;

        setTranscribing(true);
        // setError(null);

        const formData = new FormData();
        formData.append('audioFile', audioFile);

        try {
            const response = await axios.post('/Leopard/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { transcript } = response.data;
            setContent(transcript);
        } catch (err) {
            console.error("Transcription error:", err);
            setError("There was an error processing the audio file.");
        } finally {
            setTranscribing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        // const newPost = {
        //     title: title,
        //     content: content,
        // };

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image); // Dodaj obraz do FormData
        }


        axios.post('/api/posts/', formData, {
        })
            .then(response => {
                onPostAdded(response.data);
                setTitle('');
                setContent('');
                setAudioFile(null);
                setImage(null);
                setImageView(null);
                navigate('/profile');
            })
            .catch(err => {
                setError("Generating an image based on title is currently unavailable. Please try again in 30 seconds.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleWakeWordDetected = (label) => {
        if (label === "title") {
            startRecognition((spokenText) => setTitle(spokenText));
        } else if (label === "content") {
            startRecognition((spokenText) => setContent(spokenText));
        }
    };

    return (<>
        <Instructions />
        <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3, maxWidth: "sm", margin: "auto", mt: 5 }}>
            <CardContent>
                <WakeWords onWakeWordDetected={handleWakeWordDetected} />
                <Typography variant="h5" gutterBottom align="center">
                    Create a New Post
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                            InputProps={{
                                style: { fontSize: applyReducedFontSize() },
                            }}
                        />
                    </Box>
                    <Box mb={2} display="flex" alignItems="center" gap={2}>
                        <UploadButton handleFileChange={handleFileChange} />
                        <Button
                            variant="contained"
                            onClick={handleTranscription}
                            disabled={transcribing || !audioFile}
                            sx={{
                                textTransform: "none",
                                fontSize: applyReducedFontSize(),
                                py: 1,
                            }}
                        >
                            {transcribing ? "Transcribing..." : "Transcribe Audio"}
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                fontSize: applyReducedFontSize(),
                                py: 1,
                                textTransform: "none",
                            }}
                        >
                            Upload Image
                            <input
                                id="add-image-btn"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </Button>
                    </Box>
                    {imageView && (
                        <Box mb={2} textAlign="center">
                            <img
                                src={imageView}
                                alt="Uploaded Preview"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                        </Box>
                    )}
                    <Box mb={2}>
                        <TextField
                            label="Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            margin="normal"
                            InputProps={{
                                style: { fontSize: applyReducedFontSize() },
                            }}
                        />
                    </Box>
                    <Button
                        id="add-post-btn"
                        variant="contained"
                        type="submit"
                        disabled={loading || !content || !title}
                        fullWidth
                        sx={{
                            fontSize: applyReducedFontSize(),
                            py: 1.2,
                            textTransform: "none",
                        }}
                    >
                        {loading ? "Adding Post..." : "Add Post"}
                    </Button>
                </form>
                {loading && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <CircularProgress size={24} />
                    </Box>
                )}
                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </CardContent>
        </Card ></>
    );
};

export default AddPost;