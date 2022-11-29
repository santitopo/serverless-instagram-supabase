import './Profile.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Button, CircularProgress, TextField } from '@mui/material';
import { supabase } from '../supabase';

const ShowMostLikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        await supabase
            .rpc('get_top_5_liked_posts')
            .then(({ data, error }) => {
                if (error) {
                    setError(error.message);
                }
                setPosts(data);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="container">
            <Typography variant="h4" component="h1" gutterBottom>
                Most Liked Posts
            </Typography>
            {isLoading && <CircularProgress />}
            {error && (
                <Typography variant="h6" component="h2" gutterBottom>
                    {error}
                </Typography>
            )}
            {posts.map((post) => (
                <div key={post.id} className="post">
                    <Typography variant="h6" component="h2" gutterBottom>
                        {post.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {post.description}
                    </Typography>
                    <img
                        src={post.image}
                        alt="Imágen del post"
                        style={{
                            maxWidth: '100%',
                            minHeight: 400,
                            maxHeight: 400,
                            objectFit: 'cover',
                            paddingBottom: 5,
                            paddingTop: 5
                        }}
                    />
                    <Typography variant="body2" gutterBottom>
                        Total likes: {post.total_likes}
                    </Typography>
                </div>
            ))}
        </div>
    );
};

export default function Rankings() {
    return <ShowMostLikedPosts />;
}
