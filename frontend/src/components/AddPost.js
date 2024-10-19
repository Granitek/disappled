import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import UploadButton from './UploadButton';

const AddPost = ({ onPostAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const navigate = useNavigate();
    const [transcribing, setTranscribing] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const newPost = {
            title: title,
            content: content,
        };

        axios.post('http://localhost:8000/api/posts/', newPost)
            .then(response => {
                onPostAdded(response.data);
                setTitle('');
                setContent('');
                setAudioFile(null);
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

    return (
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
    );
};

export default AddPost;
