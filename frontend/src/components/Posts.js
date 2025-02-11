import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardMedia, CardContent, Typography, CircularProgress, Select, MenuItem, InputLabel } from '@mui/material';
import axios from './axiosConfig'
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from '../hooks/useFontSize';

const Posts = () => {
    const [ordering, setOrdering] = useState('created_at');
    const { data: posts, loading, error, refetch } = useFetch(`http://localhost:8000/api/posts/?ordering=${ordering}`);
    const { applyFontSize, applyReducedFontSize } = useFontSize();

    const navigate = useNavigate();
    const { user } = useAuth();

    if (loading) return <CircularProgress />;
    if (error) return <p>There was an error loading the posts.</p>;

    const handleEditClick = (id) => {
        navigate(`/EditPost/${id}`);
    };

    const handleDeleteClick = (id) => {
        axios.delete(`/api/posts/${id}/`)
            .then(() => {
                refetch();
            })
            .catch(error => {
                console.error('There was an error deleting the post!', error);
            });
    };

    const handleSortChange = (event) => {
        const field = event.target.value;
        setOrdering(field);
        refetch(`http://localhost:8000/api/posts/?ordering=${field}`);
    };

    return (
        <div style={{ fontSize: applyFontSize(), padding: '20px' }}>
            {user && (<Button
                variant="contained"
                sx={{
                    fontSize: applyReducedFontSize(),
                    mb: 3,
                    textTransform: 'none',
                }}
                onClick={() => navigate('/AddPosts')}
            >
                Add New Post
            </Button>)}
            <div style={{ marginBottom: '20px' }}>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                    value={`${ordering}`}
                    onChange={handleSortChange}
                    fullWidth
                    labelId="sort-label"
                    sx={{ fontSize: applyReducedFontSize() }}
                >
                    <MenuItem value="title" sx={{ fontSize: applyReducedFontSize() }}>
                        Title (A-Z)
                    </MenuItem>
                    <MenuItem value="-title" sx={{ fontSize: applyReducedFontSize() }}>
                        Title (Z-A)
                    </MenuItem>
                    <MenuItem value="created_at" sx={{ fontSize: applyReducedFontSize() }}>
                        Date (Oldest First)
                    </MenuItem>
                    <MenuItem value="-created_at" sx={{ fontSize: applyReducedFontSize() }}>
                        Date (Newest First)
                    </MenuItem>
                </Select>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                }}
            >
                {posts.map((post) => (
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
                            image={post.image_url || 'default_image.jpg'}
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
                                variant="body2"
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
                            {user && post.author === user.id && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleEditClick(post.id)}
                                        sx={{
                                            fontSize: applyReducedFontSize(),
                                            textTransform: 'none',
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteClick(post.id)}
                                        sx={{
                                            fontSize: applyReducedFontSize(),
                                            textTransform: 'none',
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Posts;
