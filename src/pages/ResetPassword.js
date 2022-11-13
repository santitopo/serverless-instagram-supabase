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
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Form = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const cleanForm = () => {
    setPassword("");
    setPasswordConfirmation("");
    setGeneralError("");
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      console.log("password is", password);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }
      cleanForm();
      alert("Contraseña cambiada exitosamente!");
      navigate("/home");
    } catch (e) {
      console.log(e.message);
      setGeneralError("Error cambiando su contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid item xs={5}>
      <div id="auth-button-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Cambiar contraseña:"}
        </Typography>

        <div id="text-field-container">
          <TextField
            fullWidth
            id="email-registration"
            label="Nueva Contraseña"
            variant="outlined"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div id="text-field-container">
          <TextField
            fullWidth
            id="email-registration"
            label="Confirmar contraseña"
            variant="outlined"
            type={"password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            disabled={
              !password ||
              !passwordConfirmation ||
              password !== passwordConfirmation
            }
          >
            Cambiar Contraseña
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

export default function ResetPasswordScreen() {
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
