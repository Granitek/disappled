import { useCallback } from "react";

const useSpeechRecognition = () => {
    const startRecognition = useCallback((onResult) => {
        if (!("webkitSpeechRecognition" in window)) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            onResult(spokenText);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.start();
    }, []);

    return { startRecognition };
};

export default useSpeechRecognition;
