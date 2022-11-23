import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";

import "./CreatePost.css";
import FileUploader from "../components/FileUploader";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";

const CreatePost = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useAuth();
  const email = user?.email;
  const full_name = user?.full_name;
  const username = user?.username;
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanPostForm = () => {
    setDescription("");
    setSelectedFile("");
    setGeneralError("");
  };

  const uploadPostImage = async () => {
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, selectedFile);
      if (uploadError) {
        throw uploadError;
      }
      const { data } = await supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);
      console.log("finished! :)", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");
    const imagePath = await uploadPostImage();
    const { error } = await supabase
      .from("posts")
      .insert({ description, image: imagePath, email, full_name, username });
    if (error) {
      setGeneralError(error.message);
    } else {
      cleanPostForm();
      navigate("/feed");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div class="create-post-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Crear post:"}
        </Typography>
        <div id="text-field-container">
          <TextField
            fullWidth
            id="description"
            label="Descripcion"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div id="text-field-container">
          <Box sx={{ margin: 3 }} textAlign="center">
            <FileUploader
              text={"Seleccionar Foto"}
              onFileSelectSuccess={(file) => setSelectedFile(file)}
              onFileSelectError={({ error }) => alert(error)}
              selectedFileName={selectedFile?.name}
            />
          </Box>
        </div>
        {generalError && (
          <Typography
            color={theme.palette.error.main}
            style={{ textAlign: "center" }}
          >
            {generalError}
          </Typography>
        )}

        <Box sx={{ margin: 3 }} textAlign="center">
          <Button
            onClick={handleSubmit}
            variant="contained"
            component="label"
            className="btn btn-primary"
          >
            Subir post
          </Button>
        </Box>
        {isLoading && (
          <Box sx={{ margin: 3 }} textAlign="center">
            <CircularProgress />
          </Box>
        )}
      </div>
    </>
  );
};

export default function CreatePostScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
  }
  return <CreatePost />;
}
