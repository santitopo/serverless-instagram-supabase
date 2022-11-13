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

import "./Home.css";
import FileUploader from "../components/FileUploader";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../providers/Authentication";

const RegistrationForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useAuth();
  const email = user?.email;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setSelectedFile("");
    setGeneralError("");
  };

  const uploadAvatar = async () => {
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile);
      if (uploadError) {
        throw uploadError;
      }
      const { data } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      console.log("finished! :)", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      alert(error.message);
    }
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      const avatarPath = await uploadAvatar();
      const { error } = supabase.auth.updateUser({
        email,
        password,
        data: {
          full_name: name,
          username,
          avatar_url: avatarPath,
        },
      });
      if (error) {
        throw error;
      }
      cleanForm();
      alert("Registro completado exitosamente!");
    } catch {
      setGeneralError("Error registrando usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid item xs={5}>
      <div id="auth-button-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Completar el Registro:"}
        </Typography>
        <div id="text-field-container">
          <TextField
            fullWidth
            label="Nombre de Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div id="text-field-container">
          <TextField
            fullWidth
            id="name-registration"
            label="Nombre Completo"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div id="text-field-container">
          <TextField
            fullWidth
            id="email-registration"
            label="Correo Electrónico"
            variant="outlined"
            disabled={true}
            value={email}
          />
        </div>
        <div id="text-field-container">
          <TextField
            fullWidth
            type={"password"}
            id="password-registration"
            label="Contraseña"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            onClick={submitForm}
            variant="contained"
            component="label"
            className="btn btn-primary"
            disabled={!name || !selectedFile}
          >
            Completar Registro
          </Button>
        </Box>
        {isLoading && (
          <Box sx={{ margin: 3 }} textAlign="center">
            <CircularProgress />
          </Box>
        )}
      </div>
    </Grid>
  );
};

export default function CompleteRegistration() {
  return (
    <Grid sx={{ paddingY: 20 }} style={{ height: "80vh" }} container>
      <Grid
        alignItems={"center"}
        justifyContent={"center"}
        container
        item
        spacing={3}
        xs={12}
      >
        <RegistrationForm />
      </Grid>
    </Grid>
  );
}
