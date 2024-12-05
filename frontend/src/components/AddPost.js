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
    // const [recognitionActive, setRecognitionActive] = useState(false);
    const navigate = useNavigate();
    const [transcribing, setTranscribing] = useState(false);

    const { startRecognition } = useSpeechRecognition();

    // const startSpeechRecognition = (mode) => {
    //     if (!('webkitSpeechRecognition' in window)) return;

    //     setRecognitionActive(true);
    //     const recognition = new window.webkitSpeechRecognition();
    //     recognition.lang = 'en-US';
    //     recognition.continuous = false;
    //     recognition.interimResults = false;

    //     recognition.onresult = (event) => {
    //         const spokenText = event.results[0][0].transcript;
    //         if (mode === 'title') {
    //             setTitle(spokenText);
    //         } else if (mode === 'content') {
    //             setContent(spokenText);
    //         }
    //     };

    //     recognition.onerror = (event) => {
    //         console.error("Recognition error:", event.error);
    //     };

    //     recognition.onend = () => {
    //         setRecognitionActive(false); // Ponownie zezwala na rozpoznawanie mowy
    //     };

    //     recognition.start();
    // };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const newPost = {
            title: title,
            content: content,
        };

        axios.post('/api/posts/', newPost, {
        })
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

    const handleWakeWordDetected = (label) => {
        if (label === "title") {
            startRecognition((spokenText) => setTitle(spokenText));
        } else if (label === "content") {
            startRecognition((spokenText) => setContent(spokenText));
        }
    };

    return (<>
        {/* <WakeWords onWakeWordDetected={(mode) => {
            if (!recognitionActive) {
                startSpeechRecognition(mode);
            }
        }}
        /> */}
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


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Button, TextField } from '@mui/material';
// import UploadButton from './UploadButton';
// import WakeWords from './WakeWords';

// const AddPost = ({ onPostAdded }) => {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [audioFile, setAudioFile] = useState(null);
//     const navigate = useNavigate();
//     const [transcribing, setTranscribing] = useState(false);

//     // Funkcja do rozpoznawania mowy
//     const startSpeechRecognition = (mode) => {
//         if (!('webkitSpeechRecognition' in window)) return;

//         const recognition = new window.webkitSpeechRecognition();
//         recognition.lang = 'en-US';
//         recognition.continuous = false;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const spokenText = event.results[0][0].transcript;
//             if (mode === 'title') {
//                 setTitle(spokenText);
//             } else if (mode === 'content') {
//                 setContent(spokenText);
//             }
//         };

//         recognition.onerror = (event) => {
//             console.error("Recognition error:", event.error);
//         };

//         recognition.start();
//     };

//     const handleFileChange = (e) => {
//         setAudioFile(e.target.files[0]);
//     };

//     const handleTranscription = async () => {
//         if (!audioFile) return;

//         setTranscribing(true);

//         const formData = new FormData();
//         formData.append('audioFile', audioFile);

//         try {
//             const response = await axios.post('http://localhost:8000/Leopard/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             const { transcript } = response.data;
//             setContent(transcript);
//         } catch (err) {
//             console.error("Transcription error:", err);
//             setError("There was an error processing the audio file.");
//         } finally {
//             setTranscribing(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setLoading(true);
//         setError(null);

//         const newPost = {
//             title: title,
//             content: content,
//         };

//         const token = localStorage.getItem('access_token');
//         axios.post('http://localhost:8000/api/posts/', newPost, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => {
//                 onPostAdded(response.data);
//                 setTitle('');
//                 setContent('');
//                 setAudioFile(null);
//                 navigate('/Posts');
//             })
//             .catch(err => {
//                 setError("There was an error adding the post.");
//                 console.error("There was an error adding the post!", err);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <div>
//             <WakeWords onWakeWordDetected={startSpeechRecognition} /> {/* Dodajemy komponent nasłuchujący */}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <TextField
//                         label="Title"
//                         variant="outlined"
//                         fullWidth
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         margin="normal"
//                     />
//                 </div>
//                 <div>
//                     <UploadButton handleFileChange={handleFileChange} />
//                     <Button variant="contained" onClick={handleTranscription} disabled={transcribing || !audioFile}>
//                         {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
//                     </Button>
//                 </div>
//                 <div>
//                     <TextField
//                         label="Content"
//                         variant="outlined"
//                         fullWidth
//                         multiline
//                         rows={4}
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         margin="normal"
//                     />
//                 </div>
//                 <Button variant="contained" type="submit" disabled={loading || !content || !title}>Add Post</Button>
//                 {loading && <p>Adding post...</p>}
//                 {error && <p>{error}</p>}
//             </form>
//         </div>
//     );
// };

// export default AddPost;
