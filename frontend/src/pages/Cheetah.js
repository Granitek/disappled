// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { Card, Typography } from '@mui/material';

// const Cheetah = () => {
//     const [transcript, setTranscript] = useState('');
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);

//     const handleStartRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder.current = new MediaRecorder(stream);

//         mediaRecorder.current.ondataavailable = async (event) => {
//             audioChunks.current.push(event.data);

//             const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
//             const formData = new FormData();
//             formData.append('audioFile', audioBlob);

//             try {
//                 const response = await axios.post('http://localhost:8000/Cheetah/', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });

//                 setTranscript((prev) => prev + " " + response.data.partial_transcript);
//                 audioChunks.current = [];  // Reset audio chunks after sending
//             } catch (error) {
//                 console.error('Error uploading audio: ', error);
//             }
//         };

//         mediaRecorder.current.start(1000); // Start recording with timeslice of 100ms
//         setIsRecording(true);
//     };

//     const handleStopRecording = () => {
//         mediaRecorder.current.stop();
//         setIsRecording(false);
//     };

//     return (
//         <Card variant="outlined">
//             <h1>Przekształć audio na tekst</h1>
//             <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
//                 {isRecording ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie'}
//             </button>
//             <div>
//                 <h2>Przekonwertowany tekst:</h2>
//                 <Typography variant="h4" style={{ textAlign: 'center' }}>
//                     {transcript}
//                 </Typography>
//             </div>
//         </Card>
//     );
// };

// export default Cheetah;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { Card, Typography } from '@mui/material';

// const Cheetah = () => {
//     const [recording, setRecording] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [mediaRecorder, setMediaRecorder] = useState(null);

//     const startRecording = () => {
//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then(stream => {
//                 const recorder = new MediaRecorder(stream);
//                 recorder.ondataavailable = handleDataAvailable;
//                 recorder.start();
//                 setMediaRecorder(recorder);
//                 setRecording(true);
//             })
//             .catch(error => {
//                 console.error('Error accessing microphone:', error);
//             });
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             setRecording(false);
//         }
//     };

//     const handleDataAvailable = async (event) => {
//         const formData = new FormData();
//         formData.append('audioFile', event.data);

//         try {
//             const response = await axios.post('http://localhost:8000/Cheetah/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             setTranscript(response.data.transcript);
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert('Error uploading file. Please try again.');
//         }
//     };

//     return (
//         <Card variant="outlined" style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>
//             <h1>Convert Audio to Text</h1>
//             {!recording ? (
//                 <button onClick={startRecording}>Start Recording</button>
//             ) : (
//                 <button onClick={stopRecording}>Stop Recording</button>
//             )}
//             <div style={{ marginTop: '20px' }}>
//                 <h2>Converted Text:</h2>
//                 <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
//                     {transcript}
//                 </Typography>
//             </div>
//         </Card>
//     );
// };

// export default Cheetah;

import React, { useState, useRef } from 'react';
import axios from 'axios';

const Cheetah = () => {
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleToggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current.stop();
        } else {
            // Start recording
            audioChunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioArrayBuffer = await audioBlob.arrayBuffer();
                const audioUint8Array = new Uint8Array(audioArrayBuffer);

                try {
                    const response = await axios.post('http://localhost:8000/Cheetah/', {
                        accessKey: 'your-access-key',
                        modelPath: 'path/to/your/cheetah-model',
                        audioData: audioUint8Array
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    setTranscript(response.data.transcript);
                } catch (err) {
                    setError(err.response ? err.response.data.error : err.message);
                }
            };

            mediaRecorderRef.current.start();
        }

        setIsRecording(!isRecording);
    };

    return (
        <div>
            <button onClick={handleToggleRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {error && <p>Error: {error}</p>}
            {transcript && <p>Transcript: {transcript}</p>}
        </div>
    );
};

export default Cheetah;

