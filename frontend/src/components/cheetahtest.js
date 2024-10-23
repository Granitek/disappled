import React, { useState, useRef } from 'react';

function Cheetahtest() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef(null);  // Użycie useRef do przechowywania mediaRecorder

    const startRecording = () => {
        setIsRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;  // Przypisanie mediaRecorder do referencji

                const audioChunks = [];

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'audio.wav');

                    // Wysyłanie pliku audio do endpointu Django
                    fetch('http://localhost:8000/Cheetah/', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            setTranscript(data.transcript);
                            setIsRecording(false);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            setIsRecording(false);
                        });
                };

                mediaRecorder.start();
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                setIsRecording(false);
            });
    };

    const stopRecording = () => {
        // Sprawdzamy, czy mediaRecorderRef jest prawidłowo ustawiony
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {transcript && <p>Transcript: {transcript}</p>}
        </div>
    );
}

export default Cheetahtest;
