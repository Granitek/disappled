import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import { Container, Typography, Button, CircularProgress, Card, CardMedia, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from '../hooks/useFontSize';
import WakeWords from './WakeWords';

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
        <>
            <WakeWords />
            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    p: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                }}
            >
                <Card
                    sx={{
                        boxShadow: 3,
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <CardMedia
                        component="img"
                        alt={post.title}
                        height="300"
                        image={post.image_url || 'default_image.jpg'}
                        sx={{ objectFit: 'cover' }}
                    />
                </Card>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        fontSize: applyFontSize(),
                        textAlign: 'center',
                    }}
                >
                    {post.title}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontSize: applyReducedFontSize(),
                        color: 'text.secondary',
                        whiteSpace: 'pre-line',
                        mb: 3,
                    }}
                >
                    {post.content}
                </Typography>

                {/* Jeśli użytkownik jest autorem, wyświetl przyciski */}
                {user && post.author === user.id && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditClick(post.id)}
                            sx={{
                                fontSize: applyReducedFontSize(),
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteClick(post.id)}
                            sx={{
                                fontSize: applyReducedFontSize(),
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{
                        display: 'block',
                        mx: 'auto',
                        mt: 2,
                        fontSize: applyReducedFontSize(),
                    }}
                >
                    Back to Posts
                </Button>
            </Container></>
    );
};

export default PostDetail;
