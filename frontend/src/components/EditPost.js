import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import UploadButton from './UploadButton';
import WakeWords from './WakeWords';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [transcribing, setTranscribing] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/posts/${id}/`)
            .then(response => {
                setTitle(response.data.title);
                setContent(response.data.content);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching post data');
                setLoading(false);
            });
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedPost = { title, content };

        axios.put(`http://localhost:8000/api/posts/${id}/`, updatedPost, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(() => {
                navigate('/Posts');
            })
            .catch(error => {
                setError('Error updating post');
                console.error(error);
            });
    };

    const handleFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const token = localStorage.getItem('access_token');

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
                    'Authorization': `Bearer ${token}`
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
        <WakeWords />
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
