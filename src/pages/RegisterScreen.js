import {
  Box,
  Link,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabase";

const RegistrationForm = ({ invitationId }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const cleanForm = () => {
    setName("");
    setUsername("");
    setEmail("");
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
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.REACT_APP_MAGIC_LINK_REDIRECT_URL,
          data: {
            full_name: name,
            username,
            avatar_url: avatarPath,
          },
        },
      });
      cleanForm();
      alert("Por favor confirma tu correo para completar el registro!");
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
          {"Registrarse:"}
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
            disabled={!!invitationId}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={!name || !email || !selectedFile}
          >
            Registrarse
          </Button>
        </Box>
        {isLoading && (
          <Box sx={{ margin: 3 }} textAlign="center">
            <CircularProgress />
          </Box>
        )}

        <Typography style={{ textAlign: "center" }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/home")}
            sx={{ fontSize: 16 }}
          >
            {"Ya está registrado? Iniciar sesión!"}
          </Link>
        </Typography>
      </div>
    </Grid>
  );
};

export default function RegisterScreen() {
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitationId");

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
        <RegistrationForm invitationId={invitationId} />
      </Grid>
    </Grid>
  );
}
