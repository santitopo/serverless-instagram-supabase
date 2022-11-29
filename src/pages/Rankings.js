import "./Profile.css";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "../supabase";

const ShowMostLikedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
      const { data, error } = await supabase
      .rpc('get_top_5_liked_posts')
      if (error) {
        setError(error.message);
      } else {
        setPosts(data)
        console.log(data);
      }
    setIsLoading(false);
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="empty-feed">
              <Typography>Aún no hay publicaciones...</Typography>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.post_id}>
                <div className="post-container">
                  <div className="row-container">
                    <div className="row-elements-flex">
                      <Typography variant="h6">{post.full_name}</Typography>

                      <Typography variant="body2">{`Subido el ${
                        `${post.created_at}`.split("T")[0] +
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
                      minHeight: 400,
                      maxHeight: 400,
                      objectFit: "cover",
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </>
      )}
    </>
  );
};


export default function Rankings() {
  return <ShowMostLikedPosts />;
}

