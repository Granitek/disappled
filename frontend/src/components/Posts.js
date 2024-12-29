import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardMedia, CardContent, Typography, CircularProgress, Select, MenuItem } from '@mui/material';
import axios from './axiosConfig'
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from './FontSizeContext';

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
        <div style={{ fontSize: applyFontSize() }}>
            <Button variant="contained" style={{ fontSize: applyReducedFontSize() }} onClick={() => navigate('/AddPosts')}>
                Add New Post
            </Button>
            <div style={{ margin: '20px 0' }}>
                <Select
                    value={`${ordering}`}
                    onChange={handleSortChange}
                    fullWidth
                    style={{ fontSize: applyReducedFontSize() }}
                >
                    <MenuItem value="title" style={{ fontSize: applyReducedFontSize() }}>Title (A-Z)</MenuItem>
                    <MenuItem value="-title" style={{ fontSize: applyReducedFontSize() }}>Title (Z-A)</MenuItem>
                    <MenuItem value="created_at" style={{ fontSize: applyReducedFontSize() }}>Date (Oldest First)</MenuItem>
                    <MenuItem value="-created_at" style={{ fontSize: applyReducedFontSize() }}>Date (Newest First)</MenuItem>
                </Select>
            </div>
            {
                posts.map(post => (
                    <Card key={post.id} sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            alt={post.title}
                            height="140"
                            image={post.image_url || 'default_image.jpg'}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent>
                            <Typography gutterBottom component="div" style={{ cursor: 'pointer', color: 'blue', fontSize: applyFontSize() }}
                                onClick={() => navigate(`/PostDetail/${post.id}`)}>
                                {post.title}
                            </Typography>
                            <Typography color="text.secondary" style={{ fontSize: applyReducedFontSize() }}>
                                {post.content}
                            </Typography>
                            {/* <Typography color="text.secondary" style={{ fontSize: applyReducedFontSize() }}>
                                {post.author}
                            </Typography> */}
                            {user && post.author === user.id && (<>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEditClick(post.id)}
                                    style={{ marginTop: '10px', fontSize: applyReducedFontSize() }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteClick(post.id)}
                                    style={{ marginTop: '10px', fontSize: applyReducedFontSize() }}
                                >
                                    Delete
                                </Button>
                            </>)}
                        </CardContent>
                    </Card>
                ))
            }
        </div >
    );
};

export default Posts;
