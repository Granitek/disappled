import React, { useEffect } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "./axiosConfig";

function WakeWords({ onWakeWordDetected }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

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
        {
            publicPath: '/wakewords/americano_wasm.ppn',
            label: "speech recognition",
        },
        {
            publicPath: '/wakewords/blueberry_wasm.ppn',
            label: "blueberry",
        },
        {
            publicPath: '/wakewords/terminator_wasm.ppn',
            label: "delete",
        },
        {
            publicPath: '/wakewords/alexa_wasm.ppn',
            label: "alexa",
        },
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
        axios.get('/users/profile/')
            .then(response => {
                // console.log(response.data.user.profile.listen_to_wakewords)
                if (response.data.user.profile.listen_to_wakewords) {
                    start();
                }
            })
            .catch(error => console.error(error));
    }, [isLoaded]);

    useEffect(() => {
        if (keywordDetection !== null) {
            console.log(`Keyword detected: ${keywordDetection}`);
            console.log(keywordDetection.label)
            if (keywordDetection.label === "add post") {
                navigate('/AddPosts');
                stop()
            }
            if (keywordDetection.label === "speech recognition" && (location.pathname === `/EditPost/${id}` || location.pathname === `/AddPosts`)) {
                onWakeWordDetected("title");
                // stop()
            }
            else if (keywordDetection.label === "alexa" && (location.pathname === `/EditPost/${id}` || location.pathname === `/AddPosts`)) {
                onWakeWordDetected("content");
                // stop();
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
        axios.delete(`/api/posts/${id}/`, {
        })
            .then(() => {
                navigate('/')
            })
            .catch(error => {
                console.error('There was an error deleting the post!', error);
            });
    };

    return (
        <div>
            <h2>{isListening ? "Listening..." : "Not listening"}</h2>
        </div>
    );
}

export default WakeWords;