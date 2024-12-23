import React, { useState } from 'react';
import axios from './axiosConfig';
import { Container, Typography, List, ListItem, ListItemText, Switch, FormControlLabel, MenuItem, Select, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, posts } = useAuth(); // Pobierz użytkownika i jego posty z kontekstu autoryzacji
    const [listenWakewords, setListenWakewords] = useState(user?.profile.listen_to_wakewords || false);
    const [fontSize, setFontSize] = useState(user?.profile.font_size || 'Medium');

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const handleSaveWakewords = () => {
        axios.put('/users/profile/', { listen_to_wakewords: listenWakewords })
            .then(() => alert('Settings updated successfully!'))
            .catch(error => console.error(error));
    };

    const handleSaveFontSize = () => {
        axios.put('/users/profile/', { font_size: fontSize })
            .then(() => alert('Font Size updated successfully!'))
            .catch(error => console.error(error));
    };

    const applyFontSize = () => {
        switch (fontSize) {
            case 'Small': return '14px';
            case 'Large': return '40px';
            default: return '20px';
        }
    }

    return (
        <Container maxWidth="md" style={{ fontSize: applyFontSize() }}>
            <Typography style={{ fontSize: applyFontSize() }} gutterBottom>Profile</Typography>
            {user && (
                <>
                    <Typography variant="h6">Username: {user.username}</Typography>
                    <Typography variant="h6">Email: {user.email},{user.profile.listen_to_wakewords} ,{user.profile.font_size}</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={listenWakewords}
                                onChange={(e) => setListenWakewords(e.target.checked)}
                            />
                        }
                        label="Enable wake word detection"
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveWakewords} style={{ marginTop: '20px' }}>
                        Save
                    </Button>
                    <Typography variant="h6" gutterBottom>Font Size Preference:</Typography>
                    <Select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Small">Small</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Large">Large</MenuItem>
                    </Select>
                    <Button variant="contained" color="primary" onClick={handleSaveFontSize} style={{ marginTop: '20px' }}>
                        Save
                    </Button>
                </>
            )}
            <Typography variant="h5" gutterBottom>Your Posts:</Typography>
            <List>
                {posts.map(post => (
                    <ListItem key={post.id}>
                        <ListItemText primary={post.title} secondary={post.content} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Profile;