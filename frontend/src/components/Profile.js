import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Container, Typography, List, ListItem, ListItemText, Switch, FormControlLabel, MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from '../hooks/useFontSize';

const Profile = () => {
    const { user, posts } = useAuth();
    const [listenWakewords, setListenWakewords] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortedPosts, setSortedPosts] = useState(posts);
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('asc');
    const [ordering, setOrdering] = useState('created_at:asc');
    const { fontSize, setFontSize, applyFontSize, applyReducedFontSize } = useFontSize();

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

    // const handleSaveFontSize = () => {
    //     axios.put('/users/profile/', { font_size: fontSize })
    //         .then(() => alert('Font Size updated successfully!'))
    //         .catch(error => console.error(error));
    // };

    const handleSortChange = (event) => {
        const [field, direction] = event.target.value.split(':');
        setSortField(field);
        setSortDirection(direction);
        setOrdering(event.target.value);
    };

    return (
        <Container maxWidth="md" style={{ fontSize: applyFontSize() }}>
            <Typography style={{ fontSize: applyFontSize() }} gutterBottom>Profile</Typography>
            {user && (
                <>
                    <Typography style={{ fontSize: applyReducedFontSize() }}>Username: {user.username}</Typography>
                    <Typography style={{ fontSize: applyReducedFontSize() }}>Email: {user.email}</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={listenWakewords}
                                onChange={(e) => setListenWakewords(e.target.checked)}
                            />
                        }
                        label="Enable wake word detection"
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveWakewords} style={{ marginTop: '20px', fontSize: applyReducedFontSize() }}>
                        Save
                    </Button>
                    <Typography style={{ fontSize: applyReducedFontSize() }} gutterBottom>Font Size Preference:</Typography>
                    <Select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        fullWidth
                        style={{ fontSize: applyReducedFontSize() }}
                    >
                        <MenuItem value="Small" style={{ fontSize: applyReducedFontSize() }}>Small</MenuItem>
                        <MenuItem value="Medium" style={{ fontSize: applyReducedFontSize() }}>Medium</MenuItem>
                        <MenuItem value="Large" style={{ fontSize: applyReducedFontSize() }}>Large</MenuItem>
                    </Select>
                    {/* <Button variant="contained" color="primary" onClick={handleSaveFontSize} style={{ marginTop: '20px', fontSize: applyReducedFontSize() }}>
                        Save
                    </Button> */}
                </>
            )}
            <Typography style={{ fontSize: applyReducedFontSize() }} gutterBottom>Your Posts:</Typography>
            <div style={{ margin: '20px 0' }}>
                <Select
                    value={ordering}
                    onChange={handleSortChange}
                    fullWidth
                    style={{ fontSize: applyReducedFontSize() }}
                >
                    <MenuItem value="title:asc" style={{ fontSize: applyReducedFontSize() }}>Title (A-Z)</MenuItem>
                    <MenuItem value="title:desc" style={{ fontSize: applyReducedFontSize() }}>Title (Z-A)</MenuItem>
                    <MenuItem value="created_at:asc" style={{ fontSize: applyReducedFontSize() }}>Date (Oldest First)</MenuItem>
                    <MenuItem value="created_at:desc" style={{ fontSize: applyReducedFontSize() }}>Date (Newest First)</MenuItem>
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