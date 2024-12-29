import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from './FontSizeContext';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { applyFontSize, applyReducedFontSize } = useFontSize();

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

    const handleEditClick = (id) => {
        navigate(`/EditPost/${id}`);
    };

    const handleDeleteClick = (id) => {
        axios.delete(`/api/posts/${id}/`)
            .then(() => {
                navigate(-1)
            })
            .catch(error => {
                console.error('There was an error deleting the post!', error);
            });
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Container maxWidth="md">
            <Typography style={{ fontSize: applyFontSize() }} gutterBottom>{post.title}</Typography>
            <Typography style={{ fontSize: applyReducedFontSize() }} gutterBottom>{post.content}</Typography>
            {/* <Typography style={{ fontSize: applyReducedFontSize() }} color="textSecondary">By: {post.author}</Typography> */}
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
            <Button variant="contained" onClick={() => navigate(-1)} style={{ marginTop: '10px', fontSize: applyReducedFontSize() }}>
                Back to Posts
            </Button>
        </Container>
    );
};

export default PostDetail;
