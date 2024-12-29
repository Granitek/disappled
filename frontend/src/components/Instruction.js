import React from "react";
import TextToSpeech from "./TextToSpeech";
import { useFontSize } from "./FontSizeContext";
import { Typography } from "@mui/material";

const Instructions = () => {
    const { applyFontSize } = useFontSize();
    const instructionsText = `
        Welcome to our application. To create a new post, click on the 'Add Post' button.
        To edit an existing post, navigate to the desired post and click 'Edit'.
        Use voice commands such as 'title' or 'content' to input text in the respective fields.
    `;

    return (
        <div>
            <Typography style={{ textAlign: 'center', fontSize: applyFontSize() }}>{instructionsText}</Typography>
            <TextToSpeech text={instructionsText} />
        </div>
    );
};

export default Instructions;
