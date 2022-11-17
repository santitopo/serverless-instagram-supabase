import "./Profile.css";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";
import { useNavigate, useSearchParams } from "react-router-dom";

const ShowUserProfile = ({ username }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username);
      if (error) {
        setError(error.message);
      } else {
        setUser(data[0]);
      }
      setLoading(false);
    };
    fetchUser();
  }, [username]);

  return (
    <div className="user-profile">
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {user && (
        <div>
          <Typography variant="h5">{user.full_name}</Typography>
          <Typography>{user.username}</Typography>
          <img
            src={user.avatar_url}
            alt="post"
            style={{ width: "10%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

const ShowUserPosts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("username", username)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchUserPosts();
  }, [username]);

  return (
    <div className="user-posts">
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5">Posts</Typography>
      {posts.map((post) => (
        <div key={post.id}>
          <Typography variant="h5">{post.description}</Typography>
          <img
            src={post.image}
            alt="post"
            style={{ width: "10%", height: "auto" }}
          />
        </div>
      ))}
    </div>
  );
};

export default function Profile() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  return (
    <div className="profile-container">
      <ShowUserProfile username={username} />
      <ShowUserPosts username={username} />
    </div>
  );
}
