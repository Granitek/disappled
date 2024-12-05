import React, { useState } from 'react';
import axios from './axiosConfig';
import { Container, Typography, List, ListItem, ListItemText, Switch, FormControlLabel } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, posts } = useAuth(); // Pobierz użytkownika i jego posty z kontekstu autoryzacji
    const [listenWakewords, setListenWakewords] = useState(user?.listen_wakewords || false);

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const handleSave = () => {
        axios.put('/users/profile/', { listen_to_wakewords: listenWakewords })
            .then(() => alert('Settings updated successfully!'))
            .catch(error => console.error(error));
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Profile</Typography>
            {user && (
                <>
                    <Typography variant="h6">Username: {user.username}</Typography>
                    <Typography variant="h6">Email: {user.email}</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={listenWakewords}
                                onChange={(e) => setListenWakewords(e.target.checked)}
                            />
                        }
                        label="Enable wake word detection"
                    />
                    <button onClick={handleSave}>Save</button>
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