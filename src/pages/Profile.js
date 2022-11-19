import "./Profile.css";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";
import { useNavigate, useSearchParams } from "react-router-dom";
import Feed from "./Feed";

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
            alt="No hay imagen"
            style={{ width: "10%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

const ShowUserPosts = ({ username }) => {
  return (
    <div>
      <Typography variant="h5">Posts</Typography>
      <Feed username={username} />
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
