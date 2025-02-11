import React, { useState, useEffect } from 'react';
import axios from '../components/axiosConfig';
import { Container, Typography, Switch, FormControlLabel, MenuItem, Select, Button, CircularProgress, InputLabel, Card, CardMedia, CardContent, Box } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from '../hooks/useFontSize';
import WakeWords from '../components/WakeWords';
import Instructions from '../components/Instruction';

const Profile = () => {
    const { user, posts } = useAuth();
    const [listenWakewords, setListenWakewords] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortedPosts, setSortedPosts] = useState(posts);
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('asc');
    const [ordering, setOrdering] = useState('created_at:asc');
    const { fontSize, setFontSize, applyFontSize, applyReducedFontSize } = useFontSize();
    const navigate = useNavigate()

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

    const handleSortChange = (eventOrValue) => {
        const value = typeof eventOrValue === "string" ? eventOrValue : eventOrValue.target.value;
        const [field, direction] = value.split(':');
        setSortField(field);
        setSortDirection(direction);
        setOrdering(value);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                fontSize: applyFontSize(),
                py: 4,
            }}
        >
            <WakeWords handleSortChange={handleSortChange} setFontSize={setFontSize} />
            <Instructions />
            <Typography
                gutterBottom
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: applyFontSize(),
                    mb: 3,
                }}
            >
                Profile
            </Typography>

            {user && (
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontSize: applyFontSize(), mb: 1 }}>
                        Username: {user.username}
                    </Typography>
                    <Typography sx={{ fontSize: applyFontSize(), mb: 2 }}>
                        Email: {user.email}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={listenWakewords}
                                onChange={(e) => setListenWakewords(e.target.checked)}
                                sx={{ mr: 1 }}
                            />
                        }
                        label="Enable wake word detection"
                    />
                    <Button
                        id="save-preferences-btn"
                        variant="contained"
                        color="primary"
                        onClick={handleSaveWakewords}
                        sx={{ mt: 2, fontSize: applyReducedFontSize() }}
                    >
                        Save Preferences
                    </Button>
                    <Box sx={{ mt: 3 }}>
                        <InputLabel
                            id="font-label"
                            sx={{ fontSize: applyReducedFontSize(), mb: 1 }}
                        >
                            Font Size Preference
                        </InputLabel>
                        <Select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            fullWidth
                            labelId="font-label"
                            sx={{ fontSize: applyReducedFontSize() }}
                        >
                            <MenuItem value="Small" sx={{ fontSize: applyReducedFontSize() }}>
                                Small
                            </MenuItem>
                            <MenuItem value="Medium" sx={{ fontSize: applyReducedFontSize() }}>
                                Medium
                            </MenuItem>
                            <MenuItem value="Large" sx={{ fontSize: applyReducedFontSize() }}>
                                Large
                            </MenuItem>
                        </Select>
                    </Box>
                </Box>
            )}

            <Box sx={{ mb: 4 }}>
                <InputLabel
                    id="sort-label"
                    sx={{ fontSize: applyReducedFontSize(), mb: 1 }}
                >
                    Sort by
                </InputLabel>
                <Select
                    value={ordering}
                    onChange={handleSortChange}
                    fullWidth
                    labelId="sort-label"
                    sx={{ fontSize: applyReducedFontSize() }}
                >
                    <MenuItem value="title:asc" sx={{ fontSize: applyReducedFontSize() }}>
                        Title (A-Z)
                    </MenuItem>
                    <MenuItem value="title:desc" sx={{ fontSize: applyReducedFontSize() }}>
                        Title (Z-A)
                    </MenuItem>
                    <MenuItem value="created_at:asc" sx={{ fontSize: applyReducedFontSize() }}>
                        Date (Oldest First)
                    </MenuItem>
                    <MenuItem value="created_at:desc" sx={{ fontSize: applyReducedFontSize() }}>
                        Date (Newest First)
                    </MenuItem>
                </Select>
            </Box>

            <Typography
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: applyFontSize(), mb: 3 }}
            >
                Your Posts:
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 3,
                }}
            >
                {sortedPosts.map((post) => (
                    <Card
                        key={post.id}
                        sx={{
                            maxWidth: 345,
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt={post.title}
                            height="180"
                            image={`http://localhost:8000${post.image_url || 'default_image.jpg'}`}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                component="h2"
                                sx={{
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    fontSize: applyFontSize(),
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                                onClick={() => navigate(`/PostDetail/${post.id}`)}
                            >
                                {post.title}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    fontSize: applyReducedFontSize(),
                                    mb: 2,
                                    maxHeight: '3.6em',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {post.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default Profile;