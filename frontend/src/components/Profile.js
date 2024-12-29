import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Container, Typography, List, ListItem, ListItemText, Switch, FormControlLabel, MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from './FontSizeContext';

const Profile = () => {
    const { user, posts } = useAuth();
    const [listenWakewords, setListenWakewords] = useState(false);
    // const [fontSize, setFontSize] = useState('Medium');
    const [loading, setLoading] = useState(true);
    const [sortedPosts, setSortedPosts] = useState(posts);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [ordering, setOrdering] = useState('title:asc');
    const { fontSize, setFontSize } = useFontSize();


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/users/profile/');
                setListenWakewords(response.data.user.profile.listen_to_wakewords);
                setFontSize(response.data.user.profile.font_size);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const sorted = [...posts].sort((a, b) => {
            let fieldA = a[sortField]?.toString().toLowerCase() || '';
            let fieldB = b[sortField]?.toString().toLowerCase() || '';
            if (sortDirection === 'asc') {
                return fieldA.localeCompare(fieldB, undefined, { numeric: true });
            } else {
                return fieldB.localeCompare(fieldA, undefined, { numeric: true });
            }
        });
        setSortedPosts(sorted);
    }, [posts, sortField, sortDirection]);

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    if (loading) {
        return <CircularProgress />
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

    const handleSortChange = (event) => {
        const [field, direction] = event.target.value.split(':');
        setSortField(field);
        setSortDirection(direction);
        setOrdering(event.target.value);
    };

    // const handleSaveFontSize = () => {
    //     alert(`Font size updated to ${fontSize}`);
    // };

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
            <div style={{ margin: '20px 0' }}>
                <Select
                    value={ordering}
                    onChange={handleSortChange}
                    fullWidth
                >
                    <MenuItem value="title:asc">Title (A-Z)</MenuItem>
                    <MenuItem value="title:desc">Title (Z-A)</MenuItem>
                    <MenuItem value="created_at:asc">Date (Oldest First)</MenuItem>
                    <MenuItem value="created_at:desc">Date (Newest First)</MenuItem>
                </Select>
            </div>
            <List>
                {sortedPosts.map(post => (
                    <ListItem key={post.id}>
                        <ListItemText primary={post.title} secondary={post.content} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Profile;