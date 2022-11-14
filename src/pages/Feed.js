import "./Feed.css";
import React, { useEffect, useState } from "react";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";

const LikePost = ({ postId }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId);
      if (error) {
        setError(error.message);
      } else {
        setLikes(data.length);
      }
    };
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, email: user?.email });
    if (error) {
      setError(error.message);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
    setIsLoading(false);
  };

  const handleUnlike = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("email", user?.email);
    if (error) {
      setError(error.message);
    } else {
      setLiked(false);
      setLikes(likes - 1);
    }
    setIsLoading(false);
  };

  return (
    <div className="like-container">
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={liked ? handleUnlike : handleLike}
        >
          {liked ? "Unlike" : "Like"}
        </Button>
      )}
      <Typography>{likes} likes</Typography>
    </div>
  );
};

const AddComment = ({ postId }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComment = async () => {
    setIsLoading(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      email: user?.email,
      comment,
      full_name: user?.full_name,
    });
    if (error) {
      setError(error.message);
    } else {
      setComment("");
    }
    setIsLoading(false);
  };

  return (
    <div className="comment-container">
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Escriba su comentario"
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button variant="outlined" color="primary" onClick={handleComment}>
          Comentar
        </Button>
      )}
    </div>
  );
};

const ShowComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("comment, full_name")
        .eq("post_id", postId);
      if (error) {
        setError(error.message);
      } else {
        setComments(data);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [postId]);

  return (
    <div className="comments-container">
      <Typography variant="h6">Comentarios</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        comments.map((comment) => (
          <div className="comment">
            <Typography variant="h6">{comment.full_name}</Typography>
            <Typography>{comment.comment}</Typography>
          </div>
        ))
      )}
    </div>
  );
};

const ShowFeed = ({ email }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, created_at, email, full_name, image, description")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="feed-container">
      {error && <Typography color="error">{error}</Typography>}
      {posts.map((post) => (
        <div className="post-container">
          <Typography
            sx={{ mt: 4, mb: 2 }}
            variant="h6"
            component="div"
          ></Typography>
          <Typography variant="h6">{post.full_name}</Typography>
          <Typography variant="body2">{post.description}</Typography>
          <Typography variant="body2">{`Subido: ${
            post.created_at?.split("T")[0] //TODO: Change how we handle uploaded time
          }`}</Typography>
          <img
            src={post.image}
            alt="post"
            style={{ width: "40%", height: "auto" }}
          />
          <LikePost postId={post.id} />
          <AddComment postId={post.id} />

          <ShowComments postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default function Feed() {
  const { user } = useAuth();
  const email = user?.email;

  return (
    <div className="feed-container">
      <ShowFeed email={email} />
    </div>
  );
}
