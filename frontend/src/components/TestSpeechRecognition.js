import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognitionComponent = ({ startRecognition }) => {
    // const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState('pl-PL'); // Domyślnie polski

    const [isRecognitionActive, setIsRecognitionActive] = useState(false);

    const [currentField, setCurrentField] = useState(null);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const inactivityTimer = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('Web Speech API not supported in this browser');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = language; // język polski
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    if (currentField === 'title') {
                        setTitle(prev => prev + transcriptPiece);
                    } else if (currentField === 'body') {
                        setBody(prev => prev + transcriptPiece);
                    }
                } else {
                    interimTranscript += transcriptPiece;
                }
            }
            setTranscript(interimTranscript);
            resetInactivityTimer();
        };

        recognition.onend = () => {
            setIsRecognitionActive(false);
            clearInactivityTimer();
        };


        if (startRecognition && !isRecognitionActive) {
            setIsRecognitionActive(true);
            recognition.start();
            resetInactivityTimer();
        } else if (!startRecognition && isRecognitionActive) {
            recognition.stop();
            setIsRecognitionActive(false);
        }


        return () => {
            clearInactivityTimer();
            recognition.stop();// Cleanup
        }
    }, [startRecognition, language, currentField]);

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            recognitionRef.current.stop();
            setIsRecognitionActive(false);
        }, 2000); // 2 seconds of inactivity
    };

    const clearInactivityTimer = () => {
        clearTimeout(inactivityTimer.current);
    };

    // Funkcja do zainicjowania wykrywania wake-word i uruchomienia rozpoznawania mowy
    // const startListening = async (field) => {
    //     // try {
    //     //     const response = await fetch('/api/wake-word-detect/', { method: 'POST' });
    //     //     const data = await response.json();
    //     //     if (data.wake_word_detected) {
    //     //         setListening(true);  // Rozpocznij rozpoznawanie mowy
    //     //     }
    //     // } catch (error) {
    //     //     console.error('Błąd przy nasłuchiwaniu wake-word:', error);
    //     // }
    //     setCurrentField(field)
    //     setListening(true)
    // };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const startListeningForField = (field) => {
        setCurrentField(field);
        setTranscript(''); // Clear previous transcript
    };

    return (
        <div>
            <label>
                Wybierz język:
                <select value={language} onChange={handleLanguageChange}>
                    <option value="pl-PL">Polski</option>
                    <option value="en-US">English</option>
                </select>
            </label>
            <div>
                <h3>Tytuł:</h3>
                <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => startListeningForField('title')}
                />
            </div>
            <div>
                <h3>Treść:</h3>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onFocus={() => startListeningForField('body')}
                />
            </div>
            <div>
                <h3>Transkrypcja na żywo:</h3>
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default SpeechRecognitionComponent;
