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
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Form = () => {
  const [email, setEmail] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const cleanForm = () => {
    setEmail("");
    setGeneralError("");
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      console.log("email is", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/home",
      });
      cleanForm();
      if (error) {
        throw error;
      }
      alert(
        "Por favor resetea tu contraseña con el link que te enviamos a tu correo!"
      );
    } catch (e) {
      console.log(e.message);
      setGeneralError("Error recuperando contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid item xs={5}>
      <div id="auth-button-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Recupere su contraseña:"}
        </Typography>

        <div id="text-field-container">
          <TextField
            fullWidth
            id="email-registration"
            label="Correo Electrónico"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            disabled={!email}
          >
            Recuperar Contraseña
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
            {"Volver a inicio de sesión"}
          </Link>
        </Typography>
      </div>
    </Grid>
  );
};

export default function ForgotPasswordScreen() {
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
        <Form />
      </Grid>
    </Grid>
  );
}
