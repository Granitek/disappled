import React from 'react'
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export default function UploadButton({ handleFileChange }) {
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
        // startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="audio/*" />
        </Button>
    )
}
