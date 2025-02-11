import React from "react";
import TextToSpeech from "./TextToSpeech";
import { useFontSize } from '../hooks/useFontSize';
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const Instructions = () => {
    const { applyFontSize } = useFontSize();
    const location = useLocation();
    const instructionsText = `
        Welcome to the application.
To listen to these instructions, click the "PLAY INSTRUCTIONS" button or say "terminator" if wake word detection is enabled. To stop instructions say "lavender blush".
Creating an Account: Go to the "LOGIN" tab and click "Register here".
Logging In: After creating an account, you need to log in.
Creating a New Post: Once logged in, navigate to the home page. Click the "Add New Post" button or say "add post".
Editing an Existing Post: Navigate to the desired post and click "Edit".
Deleting a Post: To delete one of your posts, click the "Delete" button.
Viewing Your Profile: Click the "YOUR PROFILE" tab or say "magenta".
Using Leopard: Click the "LEOPARD" tab or say "lime green".
Coming back: Say "americano" to navigate back to previous page.
    `;
    const instructionsAddText = `
    To listen to these instructions, click the "PLAY INSTRUCTIONS" button or say "terminator" if wake word detection is enabled. To stop instructions say "lavender blush".
        If you have enabled wakewords detection you can say "alexa" to edit content or "title" to edit title.
        You can also say "hot pink" to click "upload file" button or "white smoke" to click "add image" button.
        If you want to add post say "sandy brown".
    `;
    const instructionsProfile = `
    To listen to these instructions, click the "PLAY INSTRUCTIONS" button or say "terminator" if wake word detection is enabled. To stop instructions say "lavender blush".
        If wake word detection is enabled, the following commands are available:
        To navigate to home page say "picovoice".
        To disable the wake words detection feature, say "computer".
        To change your font size preference, say "forest green" for small, "grapefruit" for medium or "grasshopper" for large fornt size.
        To sort posts, use commands such as "deep sky blue" for oldest first, "dim grey" for newest first, "bumblebee" for title(A-Z) or "deep pink" for title(Z-A).
    `
    const instructionsLeopard = `
        If you want to upload audio file say "hot pink". To transcribe audio file say "fire brick".
    `

    const getInstructionsText = () => {
        if (location.pathname === "/profile") return instructionsProfile;
        if (location.pathname === "/leopard" || location.pathname === "/Leopard") return instructionsLeopard;
        if (location.pathname === "/AddPosts") return instructionsAddText;
        if (location.pathname.startsWith("/EditPost")) return instructionsAddText;
        return instructionsText;
    };

    return (
        <div
            style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
            }}
        >
            <Typography
                variant="h5"
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    fontSize: applyFontSize(),
                    marginBottom: '10px',
                }}
            >
                Instructions
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontSize: applyFontSize(),
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    whiteSpace: "pre-line"
                }}
            >
                {getInstructionsText()}
                {/* {location.pathname === "/" && instructionsText}
                {location.pathname === "/profile" && instructionsProfile}
                {location.pathname === "/Leopard" && instructionsLeopard}
                {location.pathname === "/AddPosts" && instructionsAddText}
                {location.pathname.startsWith("/EditPost") && instructionsAddText} */}
            </Typography>
            <div style={{ marginTop: '15px' }}>
                <TextToSpeech text={getInstructionsText()} />
            </div>
        </div>
    );
};

export default Instructions;
