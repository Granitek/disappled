import React, { useState } from 'react';
import axios from 'axios';

const Leopard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [transcript, setTranscript] = useState('');

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
        <div className="App">
            <h1>Przekształć audio na tekst</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Prześlij audio</button>
            <div>
                <h2>Przekonwertowany tekst:</h2>
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default Leopard;
