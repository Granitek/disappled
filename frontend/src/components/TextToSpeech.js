import React, { useState } from "react";
import { Button } from "@mui/material";
import { useFontSize } from '../hooks/useFontSize';

const TextToSpeech = ({ text }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { applyReducedFontSize } = useFontSize();

    const handleSpeak = () => {
        if (!window.speechSynthesis) {
            alert("Your browser does not support text-to-speech.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleSpeak}
                disabled={isSpeaking}
                variant="contained"
                color="primary"
                style={{ fontSize: applyReducedFontSize() }}>
                {isSpeaking ? "Speaking..." : "Play Instructions"}

            </Button>
            {isSpeaking && (
                <Button variant="outlined" color="secondary" onClick={handleStop} style={{ fontSize: applyReducedFontSize() }}>
                    Stop
                </Button>
            )}
        </div>
    );
};

export default TextToSpeech;
