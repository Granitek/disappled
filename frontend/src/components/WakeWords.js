import React, { useEffect } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import { useNavigate } from "react-router-dom";

function WakeWords(props) {
    const navigate = useNavigate();
    const {
        keywordDetection,
        isLoaded,
        isListening,
        error,
        init,
        start,
        stop,
        release,
    } = usePorcupine();

    const porcupineKeyword = {
        publicPath: '/wakewords/add-post_en_wasm_v3_0_0.ppn',
        label: "add post", // An arbitrary string used to identify the keyword once the detection occurs.
    }

    const porcupineKeyword1 = {
        publicPath: '/wakewords/blueberry_wasm.ppn',
        label: "edit post", // An arbitrary string used to identify the keyword once the detection occurs.
    }

    const porcupineModel = { publicPath: '/model/porcupine_params.pv', }


    useEffect(() => {
        init(
            process.env.REACT_APP_ACCESS_KEY,
            [porcupineKeyword, porcupineKeyword1],
            porcupineModel
        );
    }, []);

    useEffect(() => {
        if (isLoaded) {
            start();  // Rozpocznij nasłuchiwanie po załadowaniu
        }
    }, [isLoaded]);

    useEffect(() => {
        if (keywordDetection !== null) {
            console.log(`Keyword detected: ${keywordDetection}`);
            console.log(keywordDetection.label)
            if (keywordDetection.label === "add post") {
                navigate('/AddPosts');
            }
            if (keywordDetection.label === "edit post") {
                navigate('/EditPost/');
            }
            stop()
        }
    }, [keywordDetection, navigate]);

    useEffect(() => {
        return () => {
            release();  // Zwolnij zasoby po zakończeniu
        };
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{isListening ? "Listening..." : "Not listening"}</h2>
        </div>
    );

    // ... render component
}

export default WakeWords;