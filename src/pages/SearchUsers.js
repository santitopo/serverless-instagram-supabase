import "./SearchUsers.css";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, CircularProgress, TextField } from "@mui/material";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { supabase } from "../supabase";

const ShowSearchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", `%${search}%`);
      if (error) {
        setError(error.message);
      } else {
        if (data.length === 0) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .ilike("full_name", `%${search}%`);
          if (error) {
            setError(error.message);
          } else {
            setUsers(data);
          }
        } else {
          setUsers(data);
        }
      }
      setLoading(false);
    };
    fetchUsers();
  }, [search]);

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="user-list">
      <Typography variant="h5">Buscar usuarios</Typography>
      <TextField
        label="Ingrese nombre de usuario"
        id="search"
        name="search"
        onChange={handleChange}
        value={search}
      />
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {users.length === 0 && !loading && (
        <Typography color="textSecondary">
          No hay usuarios que coincidan con la busqueda.
        </Typography>
      )}
      {users.map((user) => (
        <div key={user.id}>
          <Typography variant="h5">{user.full_name}</Typography>
          <Typography>{user.username}</Typography>
          <Link to={`/profile?username=${user?.username}`}>
            <img
              src={user.avatar_url}
              alt="No hay imagen"
              className="profile-avatars"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default function SearchUsers() {
  return (
    <div className="search-users">
      <ShowSearchUsers />
    </div>
  );
}
