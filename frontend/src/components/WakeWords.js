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
        label: "add post",
    }

    const porcupineKeyword1 = {
        publicPath: '/wakewords/blueberry_wasm.ppn',
        label: "edit post",
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
            start();
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
            release();
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
}

export default WakeWords;