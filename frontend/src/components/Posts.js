import React from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardMedia, CardContent, Typography } from '@mui/material';
import axios from 'axios'

const Posts = ({ onPostDeleted }) => {
    const { data: posts, loading, error, refetch } = useFetch('http://localhost:8000/api/posts/');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const loggedInUserId = localStorage.getItem('user_id');

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>There was an error loading the posts.</p>;

    const handleEditClick = (id) => {
        navigate(`/EditPost/${id}`);
    };

    const handleDeleteClick = (id) => {
        axios.delete(`http://localhost:8000/api/posts/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                // onPostDeleted(id);
                refetch();
            })
            .catch(error => {
                console.error('There was an error deleting the post!', error);
            });
    };

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('/AddPosts')}>
                Add New Post
            </Button>
            {
                posts.map(post => (
                    <Card sx={{ maxWidth: 345 }} >
                        <CardMedia
                            component="img"
                            alt="post image"
                            height="140"
                            image="photo.jpg"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {post.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.content}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.author}
                            </Typography>
                            {post.author == loggedInUserId && (<>
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
