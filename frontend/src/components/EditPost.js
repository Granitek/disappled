import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import UploadButton from './UploadButton';
import WakeWords from './WakeWords';
import { useAuth } from '../hooks/useAuth';
import useSpeechRecognition from "../hooks/useSpeechRecognition"

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

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedPost = { title, content };

        axios.put(`http://localhost:8000/api/posts/${id}/`, updatedPost)
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
            const response = await axios.post('http://localhost:8000/Leopard/', formData, {
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

    // const startSpeechRecognition = (field) => {
    //     if (!('webkitSpeechRecognition' in window)) return;

    //     const recognition = new window.webkitSpeechRecognition();
    //     recognition.lang = 'en-US';
    //     recognition.continuous = false;
    //     recognition.interimResults = false;

    //     recognition.onresult = (event) => {
    //         const spokenText = event.results[0][0].transcript;
    //         if (field === 'title') {
    //             setTitle(spokenText);
    //         } else if (field === 'content') {
    //             setContent(spokenText);
    //         }
    //     };

    //     recognition.onerror = (event) => {
    //         console.error("Recognition error:", event.error);
    //     };

    //     recognition.start();
    // };

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
                />
            </div>
            <UploadButton handleFileChange={handleFileChange} />
            <Button variant="contained" onClick={handleTranscription} disabled={transcribing || !audioFile}>
                {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
            </Button>
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
                />
            </div>
            <Button type="submit" variant="contained" color="primary" disabled={loading || !content || !title}>
                Update Post
            </Button>
        </form>
    </>
    );
};

export default EditPost;
