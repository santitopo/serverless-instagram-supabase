/* eslint-disable jsx-a11y/anchor-is-valid */
import "./Feed.css";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";

const heartFilled = require("../assets/heart-filled.png");
const heartEmpty = require("../assets/heart-empty.png");
const visible = require("../assets/visible.png");
const invisible = require("../assets/invisible.png");
const commentsVisible = require("../assets/shown-comments.png");
const commentsHidden = require("../assets/hidden-comments.png");
const waste = require("../assets/waste.png");

const LikePost = ({ postId, postDescription }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLikes, setShowLikes] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const onClickShowLikes = () => {
    setShowComments(false);
    setShowLikes(true);
  };
  const onClickHideLikes = () => setShowLikes(false);
  const onClickHideComments = () => {
    setShowComments(false);
  };
  const onClickShowComments = () => {
    setShowLikes(false);
    setShowComments(true);
  };

  useEffect(() => {
    setShowLikes(false);
  }, [postId]);

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
    setError("");
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
      onClickHideLikes();
    }
    setIsLoading(false);
  };

  const handleUnlike = async () => {
    setError("");
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
      onClickHideLikes();
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className="row-container">
        {error && <Typography color="error">{error}</Typography>}
        <div class="row-elements">
          {isLoading ? (
            <CircularProgress />
          ) : (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={liked ? handleUnlike : handleLike}>
              <img
                src={liked ? heartFilled : heartEmpty}
                alt="Like"
                style={{
                  cursor: "pointer",
                  width: "25px",
                }}
              />
            </a>
          )}
        </div>
        <div class="row-elements">
          <Typography>{likes} likes</Typography>
        </div>
        <div class="row-elements">
          <a onClick={showLikes ? onClickHideLikes : onClickShowLikes}>
            <img
              alt="Eye"
              style={{
                cursor: "pointer",
                width: "25px",
              }}
              src={showLikes ? visible : invisible}
            />
          </a>
        </div>
        <div class="row-elements">
          <a onClick={showComments ? onClickHideComments : onClickShowComments}>
            <img
              alt="Comments"
              style={{
                cursor: "pointer",
                width: "25px",
              }}
              src={showComments ? commentsVisible : commentsHidden}
            />
          </a>
        </div>
      </div>
      <Typography
        style={{
          fontStyle: "italic",
          textAlign: "left",
          fontSize: "18px",
          padding: "0px 15px 15px 15px",
        }}
      >
        {postDescription}
      </Typography>
      <div>{showLikes ? <ListUsersWhoLiked postId={postId} /> : null}</div>
      {showComments ? <Comments postId={postId} /> : null}
    </>
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
          {usersLiked.length > 0 && <Typography variant="h6">Likes</Typography>}
          {usersLiked.length === 0 && (
            <Typography style={{ textAlign: "left" }}>
              Sin me gustas todavía!
            </Typography>
          )}
          {usersLiked.map((user) => (
            <Typography key={user.username} style={{ textAlign: "left" }}>
              {user.username}
            </Typography>
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
      .select("comment, full_name, username, created_at")
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
      <ShowComments comments={comments} isLoading={isLoading} error={error} />
      <AddComment postId={postId} onUpdate={fetchComments} />
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
      <div class="row-elements-flex">
        <TextField
          label="Escriba su comentario"
          style={{ width: "100%" }}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div class="row-elements">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button variant="outlined" color="primary" onClick={handleComment}>
            Comentar
          </Button>
        )}
      </div>
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
          {"["}
          {`${comment.created_at}`.split("T")[0]}
          {"]"} {comment.full_name}: {comment.comment}
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

const DeletePost = ({ postId, refreshMainPostList }) => {
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
    refreshMainPostList();
  };

  return (
    <div className="delete-container">
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <a onClick={handleDelete}>
          <img
            src={waste}
            alt="Like"
            style={{
              cursor: "pointer",
              width: "30px",
            }}
          />
        </a>
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
  }, [page, username]);

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
              <div key={post.id}>
                <div className="post-container">
                  <div class="row-container">
                    <div class="row-elements-flex">
                      <Typography variant="h6">{post.full_name}</Typography>

                      <Typography variant="body2">{`Subido el ${
                        `${post.created_at}`.split("T")[0] +
                        " " +
                        "a las " +
                        `${post.created_at}`.split("T")[1].split(".")[0]
                      }`}</Typography>
                    </div>
                    <div class="row-elements">
                      {post.username === user?.username && (
                        <DeletePost
                          postId={post.id}
                          refreshMainPostList={fetchPosts}
                        />
                      )}
                    </div>
                  </div>
                  <img
                    src={post.image}
                    alt="Imágen del post"
                    style={{
                      maxWidth: "100%",
                      height: 500,
                      width: "100%",
                      objectFit: "cover",
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  />
                  <LikePost
                    postId={post.id}
                    postDescription={post?.description}
                  />
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
        </>
      )}
    </>
  );
};

export default function Feed({ username = "" }) {
  return <ShowFeed username={username} />;
}
