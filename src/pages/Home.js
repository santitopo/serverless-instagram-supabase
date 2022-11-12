import {
  Box,
  Link,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
  Switch,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import UserController from "../firebase/controllers/users";
import "./Home.css";
import { selectUser } from "../redux/auth";
import { useIsLoggedIn } from "../providers/Authentication";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { supabase } from "../supabase";

const onEmailPasswordSignIn = async (auth, email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const onEmailPasswordSignUp = async (
  auth,
  name,
  email,
  password,
  profilePicture
) => {
  const storage = getStorage();
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      // Signed in
      const fbUser = userCredential.user;
      // Registered properly
      // Upload picture
      let profilePictureURL = null;
      try {
        const imageRef = ref(storage, `profilePictures/${fbUser.uid}.jpg`);
        await uploadBytes(imageRef, profilePicture);
        profilePictureURL = await getDownloadURL(imageRef);
      } catch (e) {
        console.log("error trying to upload profile picture", e);
      }
      // Register user in firestore
      await UserController.postUser(
        {
          name,
          email,
          profilePicture: profilePictureURL,
        },
        fbUser.uid
      );
      sendEmailVerification(userCredential.user);
    }
  );
};

const EmailPasswordLogin = ({ goToRegistration }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState(null);
  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setGeneralError("Error iniciando sesión");
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitMagicLinkLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: process.env.REACT_APP_MAGIC_LINK_REDIRECT_URL,
        },
      });
      if (error) {
        throw error;
      }
      alert("Encontrarás un link de login en tu mail!");
    } catch (error) {
      setGeneralError("Error iniciando sesión");
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="text-field-container">
        <TextField
          fullWidth
          id="email-login"
          label="Correo Electronico"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setGeneralError(null);
            setEmail(e.target.value);
          }}
        />
      </div>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item>
          <Typography>{"Iniciar sesión con contraseña?"}</Typography>
        </Grid>
        <Grid item>
          <Switch
            checked={loginWithPassword}
            onChange={() => setLoginWithPassword(!loginWithPassword)}
          />
        </Grid>
      </Grid>
      {loginWithPassword && (
        <>
          <div id="text-field-container">
            <TextField
              fullWidth
              id="password-login"
              label="Contraseña"
              type={"password"}
              variant="outlined"
              value={password}
              onChange={(e) => {
                setGeneralError(null);
                setPassword(e.target.value);
              }}
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
          <Typography style={{ textAlign: "center" }}>
            <Link
              component="button"
              variant="body2"
              //onClick={goToRegistration}
              sx={{ fontSize: 16 }}
            >
              {"Olvidó su contraseña?"}
            </Link>
          </Typography>
        </>
      )}

      <Box sx={{ margin: 3 }} textAlign="center">
        <Button
          onClick={loginWithPassword ? submitLoginForm : submitMagicLinkLogin}
          variant="contained"
          component="label"
          className="btn btn-primary"
          disabled={!email || (!password && loginWithPassword)}
        >
          {loginWithPassword
            ? "Iniciar Sesión"
            : "Iniciar Sesión Con Magic Link"}
        </Button>
      </Box>
      {loading && (
        <Box sx={{ margin: 3 }} textAlign="center">
          <CircularProgress />
        </Box>
      )}

      <Typography style={{ textAlign: "center" }}>
        <Link
          component="button"
          variant="body2"
          onClick={goToRegistration}
          sx={{ fontSize: 16 }}
        >
          {"No tiene cuenta aún? Regístrese!"}
        </Link>
      </Typography>
    </>
  );
};

const AuthButtons = () => {
  const navigate = useNavigate();
  return (
    <Grid item xs={5}>
      <div id="auth-button-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Iniciar Sesión:"}
        </Typography>
        <EmailPasswordLogin goToRegistration={() => navigate("/register")} />
      </div>
    </Grid>
  );
};

const AuthForms = () => {
  return (
    <>
      <Grid sx={{ paddingY: 20 }} style={{ height: "80vh" }} container>
        <Grid
          alignItems={"center"}
          justifyContent={"center"}
          container
          item
          spacing={3}
          xs={12}
        >
          <AuthButtons />
        </Grid>
      </Grid>
    </>
  );
};

const Welcome = () => {
  const user = useSelector(selectUser);

  return (
    <Grid
      sx={{ paddingX: 50, paddingY: 20 }}
      style={{ height: "100vh" }}
      container
      rowSpacing={3}
    >
      <Grid item xs={12}>
        <Typography fontSize={24} style={{ textAlign: "center" }}>
          {`Bienvenido ${user.displayName},`}
        </Typography>
        <Typography fontSize={20} style={{ textAlign: "center" }}>
          {`Abre el menú de la izquierda para comenzar a chatear!`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default function Home() {
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? <Welcome /> : <AuthForms />;
}
