import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import { Container, Typography, Button } from '@mui/material';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/posts/${id}/`)
            .then(response => {
                setPost(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching post details');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>{post.title}</Typography>
            <Typography variant="body1" gutterBottom>{post.content}</Typography>
            <Typography variant="subtitle1" color="textSecondary">By: {post.author}</Typography>
            <Button variant="contained" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                Back to Posts
            </Button>
        </Container>
    );
};

export default PostDetail;
