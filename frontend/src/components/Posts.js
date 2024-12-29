import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardMedia, CardContent, Typography, CircularProgress, Select, MenuItem } from '@mui/material';
import axios from './axiosConfig'
import { useAuth } from '../hooks/useAuth';

const Posts = () => {
    const [ordering, setOrdering] = useState('created_at');
    const { data: posts, loading, error, refetch } = useFetch(`http://localhost:8000/api/posts/?ordering=${ordering}`);

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
        <div>
            <Button variant="contained" onClick={() => navigate('/AddPosts')}>
                Add New Post
            </Button>
            <div style={{ margin: '20px 0' }}>
                <Select
                    value={`${ordering}`}
                    onChange={handleSortChange}
                    fullWidth
                >
                    <MenuItem value="title">Title (A-Z)</MenuItem>
                    <MenuItem value="-title">Title (Z-A)</MenuItem>
                    <MenuItem value="created_at">Date (Oldest First)</MenuItem>
                    <MenuItem value="-created_at">Date (Newest First)</MenuItem>
                </Select>
            </div>
            {
                posts.map(post => (
                    <Card key={post.id} sx={{ maxWidth: 345 }} >
                        <CardMedia
                            component="img"
                            alt={post.title}
                            height="140"
                            image={post.image_url || 'default_image.jpg'}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" style={{ cursor: 'pointer', color: 'blue' }}
                                onClick={() => navigate(`/PostDetail/${post.id}`)}>
                                {post.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.content}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.author}
                            </Typography>
                            {user && post.author === user.id && (<>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEditClick(post.id)}
                                    style={{ marginTop: '10px' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteClick(post.id)}
                                    style={{ marginTop: '10px' }}
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
