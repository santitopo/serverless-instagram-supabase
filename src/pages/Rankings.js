import './Ranking.css';
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
      Top 5 posts con mayor cantidad de likes
      </Typography>
      {isLoading && <CircularProgress />}
      {error && (
        <Typography variant="h6" component="h2" gutterBottom>
          {error}
        </Typography>
      )}
      <div className="posts-container">

        {

          posts.map((post, index) => (
            <div key={post.post_id}>
              <Typography variant="h3">{index + 1}</Typography>
              <div className="post-container">
                <div class="row-container">
                  <div class="row-elements-flex">
                    <Typography variant="h6">{post.full_name}</Typography>

                    <Typography variant="body2">{`Subido el ${`${post.created_at}`.split("T")[0] +
                      " " +
                      "a las " +
                      `${post.created_at}`.split("T")[1].split(".")[0]
                      }`}</Typography>
                  </div>
                </div>
                <img
                  src={post.image}
                  alt="Imágen del post"
                  style={{
                    maxWidth: "100%",
                    minHeight: 100,
                    maxHeight: 100,
                    objectFit: "cover",
                    paddingBottom: 5,
                    paddingTop: 5,
                  }}
                />
                <Typography>{post.total_likes} likes</Typography>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const ShowTopPosters = () => {
  const [posters, setPosters] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPoster = useCallback(async () => {
    setIsLoading(true);
    await supabase
      .rpc('get_top_5_posters')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        }
        setPosters(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchPoster();
  }, [fetchPoster]);

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
      Top 5 usuarios con mayor cantidad de posts
      </Typography>
      {isLoading && <CircularProgress />}
      {error && (
        <Typography variant="h6" component="h2" gutterBottom>
          {error}
        </Typography>
      )}
      <div className="posts-container">

        {

      posters.map((poster, index) => (
            <div key={poster.email}>
              <Typography variant="h3">{index + 1}</Typography>
              <div className="post-container">
                <div class="row-container">
                  <div class="row-elements-flex">
                    <Typography variant="h6">{poster.full_name}</Typography>
                  </div>
                </div>
                <img
                  src={poster.avatar_url}
                  alt="Imágen del post"
                  style={{
                    maxWidth: "100%",
                    minHeight: 100,
                    maxHeight: 100,
                    objectFit: "cover",
                    paddingBottom: 5,
                    paddingTop: 5,
                  }}
                />
                <Typography>{poster.total_posts} posts</Typography>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const ShowTopCommenter = () => {
  const [commenters, setCommenters] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommenter = useCallback(async () => {
    setIsLoading(true);
    await supabase
      .rpc('get_top_5_commenters')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        }
        setCommenters(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCommenter();
  }, [fetchCommenter]);

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
      Top 5 usuarios con mayor cantidad de comentarios
      </Typography>
      {isLoading && <CircularProgress />}
      {error && (
        <Typography variant="h6" component="h2" gutterBottom>
          {error}
        </Typography>
      )}
      <div className="posts-container">

        {

      commenters.map((commenter, index) => (
            <div key={commenter.email}>
              <Typography variant="h3">{index + 1}</Typography>
              <div className="post-container">
                <div class="row-container">
                  <div class="row-elements-flex">
                    <Typography variant="h6">{commenter.full_name}</Typography>
                  </div>
                </div>
                <img
                  src={commenter.avatar_url}
                  alt="Imágen del post"
                  style={{
                    maxWidth: "100%",
                    minHeight: 100,
                    maxHeight: 100,
                    objectFit: "cover",
                    paddingBottom: 5,
                    paddingTop: 5,
                  }}
                />
                <Typography>{commenter.total_comments} comentarios</Typography>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
const Ranking = () => {
  return (
    <>
      <ShowMostLikedPosts /> 
      <ShowTopPosters/>
      <ShowTopCommenter/>
    </>
  );
};
export default function Rankings() {
  return <Ranking/>;
}
