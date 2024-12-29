import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, CircularProgress, } from '@mui/material';
import UploadButton from './UploadButton';
import WakeWords from './WakeWords';
import { useAuth } from '../hooks/useAuth';
import useSpeechRecognition from "../hooks/useSpeechRecognition"
import { useFontSize } from './FontSizeContext';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [transcribing, setTranscribing] = useState(false);
    const { user } = useAuth();
    const [imageFile, setImageFile] = useState(null);
    const { applyFontSize, applyReducedFontSize } = useFontSize();

    const { startRecognition } = useSpeechRecognition();

    useEffect(() => {
        // Pobierz dane posta i sprawdź, czy użytkownik jest autorem
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}/`
                );

                if (response.data.author !== user.id) {
                    // Jeśli użytkownik nie jest autorem posta, przekieruj
                    navigate('/posts');
                } else {
                    setTitle(response.data.title);
                    setContent(response.data.content);
                }
            } catch (err) {
                setError('Error fetching post data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPost();
        } else {
            navigate('/login');
        }
    }, [id, user, navigate]);

    const handleImageFileChange = (e) => {
        if (e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
            console.log("Obraz " + imageFile)
        } else {
            setImageFile(null);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        if (imageFile) {
            formData.append('image', imageFile);  // Dodaj obraz, jeśli istnieje
        }

        // const updatedPost = { title, content };

        axios.put(`/api/posts/${id}/`, formData)
            .then(() => {
                navigate('/Posts');
            })
            .catch(error => {
                setError('Error updating post');
                console.error(error);
            });
    };

    const handleWakeWordDetected = (label) => {
        if (label === "title") {
            startRecognition((spokenText) => setTitle(spokenText));
        } else if (label === "content") {
            startRecognition((spokenText) => setContent(spokenText));
        }
    };

    const handleFileChange = (e) => {
        setAudioFile(e.target.files[0]);
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

    if (loading) return <CircularProgress />;
    if (error) return <p>{error}</p>;

    return (<>
        <WakeWords onWakeWordDetected={handleWakeWordDetected} />
        <form onSubmit={handleUpdate}>
            <div>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    InputProps={{
                        style: {
                            fontSize: applyReducedFontSize(),
                        },
                    }}
                />
            </div>
            <UploadButton handleFileChange={handleFileChange} />
            <Button variant="contained" onClick={handleTranscription} disabled={transcribing || !audioFile} style={{ fontSize: applyReducedFontSize() }}>
                {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
            </Button>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ fontSize: applyReducedFontSize() }}
                />
            </div>
            <div>
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
                        style: {
                            fontSize: applyReducedFontSize(),
                        },
                    }}
                />
            </div>
            <Button type="submit" variant="contained" color="primary" disabled={loading || !content || !title} style={{ fontSize: applyReducedFontSize() }}>
                Update Post
            </Button>
        </form>
    </>
    );
};

export default EditPost;
