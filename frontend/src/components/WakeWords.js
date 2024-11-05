import React, { useEffect, useState } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios'
import SpeechRecognitionComponent from "./TestSpeechRecognition";

function WakeWords({ onWakeWordDetected }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const token = localStorage.getItem('access_token');

    // const [startSpeechRecognition, setStartSpeechRecognition] = useState(false);

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

    const porcupineKeyword = [
        {
            publicPath: '/wakewords/add-post_en_wasm_v3_0_0.ppn',
            label: "add post",
        },
        // {
        //     publicPath: '/wakewords/blueberry_wasm.ppn',
        //     label: "edit post",
        // },
        {
            publicPath: '/wakewords/blueberry_wasm.ppn',
            label: "delete",
        }
    ]

    const porcupineModel = { publicPath: '/model/porcupine_params.pv', }


    useEffect(() => {
        init(
            process.env.REACT_APP_ACCESS_KEY,
            porcupineKeyword,
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
                // navigate('/AddPosts');
                onWakeWordDetected()
                stop()
            }
            if (keywordDetection.label === "edit post") {
                navigate('/EditPost/');
                stop()
            }
            if (keywordDetection.label === "delete" && location.pathname === `/EditPost/${id}`) {
                handleDeletePost();
                stop()
            }

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

    const handleDeletePost = () => {
        console.log(id)
        axios.delete(`http://localhost:8000/api/posts/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                // onPostDeleted(id);
                // refetch();
                navigate('/')
            })
            .catch(error => {
                console.error('There was an error deleting the post!', error);
            });
    };

    return (
        <div>
            <h2>{isListening ? "Listening..." : "Not listening"}</h2>
            {/* <SpeechRecognitionComponent startRecognition={startSpeechRecognition} /> */}
        </div>
    );
}

export default WakeWords;