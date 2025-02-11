import React, { useEffect } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "./axiosConfig";
import { CircularProgress } from "@mui/material";

function WakeWords({ onWakeWordDetected, handleSortChange, setFontSize }) {
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
            publicPath: '/wakewords/title_en_wasm_v3_0_0.ppn',
            label: "modify",
        },
        {
            publicPath: '/wakewords/alexa_wasm.ppn',
            label: "alexa",
        },
        {
            publicPath: '/wakewords/blueberry_wasm.ppn',
            label: "delete",
        },
        {
            publicPath: '/wakewords/terminator_wasm.ppn',
            label: "play",
        },
        {
            publicPath: '/wakewords/computer_wasm.ppn',
            label: "disable",
        },
        {
            publicPath: '/wakewords/bumblebee_wasm.ppn',
            label: "titleAsc",
        },
        {
            publicPath: '/wakewords/deep_pink_wasm.ppn',
            label: "titleDesc",
        },
        {
            publicPath: '/wakewords/deep_sky_blue_wasm.ppn',
            label: "createdAtAsc",
        },
        {
            publicPath: '/wakewords/dim_gray_wasm.ppn',
            label: "DescCreated",
        },
        {
            publicPath: '/wakewords/forest_green_wasm.ppn',
            label: "small",
        },
        {
            publicPath: '/wakewords/grapefruit_wasm.ppn',
            label: "not small",
        },
        {
            publicPath: '/wakewords/grasshopper_wasm.ppn',
            label: "large",
        },
        {
            publicPath: '/wakewords/lime_green_wasm.ppn',
            label: "leopard",
        },
        {
            publicPath: '/wakewords/magenta_wasm.ppn',
            label: "profile",
        },
        {
            publicPath: '/wakewords/americano_wasm.ppn',
            label: "come back",
        },
        {
            publicPath: '/wakewords/sandy_brown_wasm.ppn',
            label: "add post button",
        },
        {
            publicPath: '/wakewords/white_smoke_wasm.ppn',
            label: "add image button",
        },
        {
            publicPath: '/wakewords/fire_brick_wasm.ppn',
            label: "transcribe button",
        },
        {
            publicPath: '/wakewords/hot_pink_wasm.ppn',
            label: "audio file",
        },
        {
            publicPath: '/wakewords/lavender_blush_wasm.ppn',
            label: "stop instructions",
        },
        {
            publicPath: '/wakewords/picovoice_wasm.ppn',
            label: "home",
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
            }
            if (keywordDetection.label === "modify" && (location.pathname === `/EditPost/${id}` || location.pathname === `/AddPosts`)) {
                onWakeWordDetected("title");
            }
            if (keywordDetection.label === "alexa" && (location.pathname === `/EditPost/${id}` || location.pathname === `/AddPosts`)) {
                onWakeWordDetected("content");
            }
            if (keywordDetection.label === "delete" && (location.pathname === `/EditPost/${id}` || location.pathname === `/PostDetail/${id}`)) {
                handleDeletePost();
                stop()
            }
            if (keywordDetection.label === "play") {
                document.getElementById('play-instructions-btn')?.click();
            }
            if (keywordDetection.label === "stop instructions") {
                document.getElementById('stop-instructions-btn')?.click();
            }
            if (keywordDetection.label === "disable") {
                const switchElement = document.querySelector('input[type="checkbox"]');
                if (switchElement && switchElement.checked) {
                    switchElement.click();
                }
                setTimeout(() => {
                    document.getElementById('save-preferences-btn')?.click();
                }, 300);
            }
            if (keywordDetection.label === "titleAsc") {
                handleSortChange("title:asc");
            }
            if (keywordDetection.label === "titleDesc") {
                handleSortChange("title:desc");
            }
            if (keywordDetection.label === "createdAtAsc") {
                handleSortChange("created_at:asc");
            }
            if (keywordDetection.label === "DescCreated") {
                handleSortChange("created_at:desc");
            }
            if (keywordDetection.label === "small") {
                setFontSize("Small");
            }
            if (keywordDetection.label === "not small") {
                setFontSize("Medium");
            }
            if (keywordDetection.label === "large") {
                setFontSize("Large");
            }
            if (keywordDetection.label === "add post button") {
                document.getElementById('add-post-btn')?.click();
            }
            if (keywordDetection.label === "add image button") {
                document.getElementById('add-image-btn')?.click();
            }
            if (keywordDetection.label === "audio file") {
                document.getElementById('add-file-btn')?.click();
            }
            if (keywordDetection.label === "transcribe button") {
                document.getElementById('transcribe-btn')?.click();
            }
            if (keywordDetection.label === "profile") {
                navigate('/profile');
            }
            if (keywordDetection.label === "leopard") {
                navigate('/leopard');
            }
            if (keywordDetection.label === "come back") {
                navigate(-1);
            }
            if (keywordDetection.label === "home") {
                navigate('/');
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
        return <CircularProgress />;
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
            {/* <h2>{isListening ? "Listening..." : "Not listening"}</h2> */}
        </div>
    );
}

export default WakeWords;