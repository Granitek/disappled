import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import UploadButton from './UploadButton';
import WakeWords from './WakeWords';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const AddPost = ({ onPostAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const navigate = useNavigate();
    const [transcribing, setTranscribing] = useState(false);
    const [image, setImage] = useState(null);

    const { startRecognition } = useSpeechRecognition();

    const handleFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
        } else {
            setImage(null);
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
                navigate('/Posts');
            })
            .catch(err => {
                setError("There was an error adding the post.");
                console.error("There was an error adding the post!", err);
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
        <WakeWords onWakeWordDetected={handleWakeWordDetected} />
        <form onSubmit={handleSubmit}>
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
            <div>
                <UploadButton handleFileChange={handleFileChange} />
                <Button variant="contained" onClick={handleTranscription} disabled={transcribing || !audioFile}>
                    {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
                </Button>
            </div>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
                />
            </div>
            <Button variant="contained" type="submit" disabled={loading || !content || !title}>Add Post</Button>
            {loading && <p>Adding post...</p>}
            {error && <p>{error}</p>}
        </form>
    </>);
};

export default AddPost;