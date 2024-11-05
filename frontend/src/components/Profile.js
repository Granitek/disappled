// src/Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/users/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setUserData(response.data.user);
                setUserPosts(response.data.posts);
            })
            .catch(error => {
                setError('Failed to load profile data.');
            });
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Profile</Typography>
            {userData && (
                <>
                    <Typography variant="h6">Username: {userData.username}</Typography>
                    <Typography variant="h6">Email: {userData.email}</Typography>
                </>
            )}
            <Typography variant="h5" gutterBottom>Your Posts:</Typography>
            <List>
                {userPosts.map(post => (
                    <ListItem key={post.id}>
                        <ListItemText primary={post.title} secondary={post.content} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Profile;
