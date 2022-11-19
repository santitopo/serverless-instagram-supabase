import "./Feed.css";
import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
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

  useEffect(() => {
    const fetchLiked = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("username", user.username);
      if (error) {
        setError(error.message);
      } else {
        setLiked(data.length > 0);
      }
    };
    fetchLiked();
  }, [postId, user.username]);

  const handleLike = async () => {
    setIsLoading(true);
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      email: user?.email,
      username: user?.username,
    });
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
      .eq("username", user?.username);
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

const ShowUsersWhoLiked = ({ postId }) => {
  const [showResults, setShowResults] = React.useState(false);
  useEffect(() => {
    setShowResults(false);
  }, [postId]);

  const onClick = () => setShowResults(true);
  const onClickHide = () => setShowResults(false);

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={showResults ? onClickHide : onClick}
      >
        {showResults ? "Ocultar Likes" : "Mostrar Likes"}
      </Button>
      {showResults ? <ListUsersWhoLiked postId={postId} /> : null}
    </div>
  );
};

const ListUsersWhoLiked = ({ postId }) => {
  const [usersLiked, setUsersLiked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsersLiked = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("likes")
        .select("username")
        .eq("post_id", postId);
      if (error) {
        setError(error.message);
      } else {
        if (data.length > 0) {
          setUsersLiked(data);
        } else {
          setUsersLiked([]);
        }
      }
      setIsLoading(false);
    };
    fetchUsersLiked();
  }, [postId]);

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="users-liked-container">
          {usersLiked.length > 0 && (
            <Typography>Personas a las que le gusto esto:</Typography>
          )}
          {usersLiked.length === 0 && (
            <Typography>Aún no le gusta a nadie :(</Typography>
          )}
          {usersLiked.map((user) => (
            <Typography key={user.username}>{user.username}</Typography>
          ))}
        </div>
      )}
    </>
  );
};

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("comment, full_name, username")
      .eq("post_id", postId);
    if (error) {
      setError(error.message);
    } else {
      setComments(data);
    }
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <AddComment postId={postId} onUpdate={fetchComments} />
      <ShowComments comments={comments} isLoading={isLoading} error={error} />
    </>
  );
};

const AddComment = ({ postId, onUpdate }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComment = async () => {
    setIsLoading(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      email: user?.email,
      username: user?.username,
      comment,
      full_name: user?.full_name,
    });
    if (error) {
      setError(error.message);
    } else {
      setComment("");
      onUpdate();
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

const ShowComments = ({ comments, isLoading, error }) => {
  const renderComments = () => {
    if (isLoading) {
      return <CircularProgress />;
    } else if (error) {
      return <Typography color="error">{error}</Typography>;
    } else if (comments.length === 0) {
      return <Typography>Aún no hay comentarios...</Typography>;
    } else {
      return comments.map((comment, index) => (
        <Typography key={index}>
          {comment.full_name}: {comment.comment}
        </Typography>
      ));
    }
  };
  return (
    <div className="comments-container">
      <Typography variant="h6">Comentarios</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="row container">{renderComments()}</div>
      )}
    </div>
  );
};

const DeletePost = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    const deletePostLikes = async () => {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId);
      if (error) {
        setError(error.message);
      }
    };
    const deletePostComments = async () => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("post_id", postId);
      if (error) {
        setError(error.message);
      }
    };
    const deletePost = async () => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) {
        setError(error.message);
      }
    };
    await deletePostLikes();
    await deletePostComments();
    await deletePost();
    setIsLoading(false);
  };

  return (
    <div className="delete-container">
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button variant="outlined" color="secondary" onClick={handleDelete}>
          Eliminar
        </Button>
      )}
    </div>
  );
};

const ShowFeed = ({ username }) => {
  //TODO: See if we don't need to show own users posts and filter by username
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [hasLess, setHasLess] = useState(false);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    if (username !== "") {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, email, full_name, image, description, username"
        )
        .order("created_at", { ascending: false })
        .eq("username", username)
        .range(page * 5, page * 5 + 4);
      if (error) {
        setError(error.message);
      } else {
        setPosts(data);
        data.length < 5 ? setHasMore(false) : setHasMore(true);
      }
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, email, full_name, image, description, username"
        )
        .order("created_at", { ascending: false })
        .range(page * 5, page * 5 + 4);
      if (error) {
        setError(error.message);
      } else {
        setPosts(data);
        data.length < 5 ? setHasMore(false) : setHasMore(true);
      }
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setHasLess(true);
  };

  const handleLoadLess = () => {
    setPage((prevPage) => prevPage - 1);
    if (page === 1) {
      setHasLess(false);
    }
  };

  return (
    <div className="feed-container">
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="feed-container">
          {posts.length === 0 ? (
            <div className="empty-feed">
              <Typography>Aún no hay publicaciones...</Typography>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id}>
                <div className="post-container">
                  {post.username === user?.username && (
                    <DeletePost postId={post.id} />
                  )}
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
                    alt="No se pudo cargar la imagen"
                    className="post-image"
                  />
                  <LikePost postId={post.id} />
                  <ShowUsersWhoLiked postId={post.id} />
                  <Comments postId={post.id} />
                </div>
              </div>
            ))
          )}
          <div className="pagination-container">
            {hasLess && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLoadLess}
              >
                Anterior
              </Button>
            )}
            {hasMore && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLoadMore}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Feed({ username = "" }) {
  return (
    <div className="feed-container">
      <ShowFeed username={username} />
    </div>
  );
}
