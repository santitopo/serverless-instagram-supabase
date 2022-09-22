import {
  Box,
  Link,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import "./Home.css";
import { auth } from "..";
import { selectUser } from "../redux/auth";
import { useIsLoggedIn } from "../providers/Authentication";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "@mui/icons-material";

const provider = new GoogleAuthProvider();

const onGoogleSignIn = async () => {
  return signInWithPopup(auth, provider);
};

const onEmailPasswordSignIn = async (email, password) => {
  console.log("about to login with", email, password);
  return signInWithEmailAndPassword(auth, email, password);
};

const onEmailPasswordSignUp = (name, email, password, profilePicture) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

const GOOGLE_RED = "#F65654";
const FACEBOOK_BLUE = "#1273EB";

const SSOProviderButton = ({ color, icon, text, onPress }) => {
  return (
    <>
      <div
        onClick={onPress}
        style={{ borderColor: color }}
        id="sso-provider-button"
      >
        <img id="button-icon" src={icon} alt={"Button Icon"} />
        <Typography style={{ color, ...styles.text }}>{text}</Typography>
      </div>
    </>
  );
};

const GoogleButton = () => {
  return (
    <SSOProviderButton
      onPress={onGoogleSignIn}
      color={GOOGLE_RED}
      text={"Continuar con Google"}
      icon={require("../assets/google.png")}
    />
  );
};

const FacebookButton = () => {
  return (
    <SSOProviderButton
      color={FACEBOOK_BLUE}
      text={"Continuar con Facebook"}
      icon={require("../assets/facebook.png")}
    />
  );
};

const EmailPasswordLogin = ({ goToRegistration }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState(null);
  const theme = useTheme();

  const submitLoginForm = async () => {
    try {
      await onEmailPasswordSignIn(email, password);
    } catch (e) {
      console.log(e);
      setGeneralError("Error iniciando sesión");
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
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div id="text-field-container">
        <TextField
          fullWidth
          id="password-login"
          label="Contraseña"
          type={"password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={submitLoginForm}
          variant="contained"
          component="label"
          className="btn btn-primary"
          disabled={!password || !email}
        >
          Iniciar Sesión
        </Button>
      </Box>
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

const AuthButtons = ({ goToRegistration }) => {
  return (
    <>
      <Grid item xs={5}>
        <div id="auth-button-container">
          <Typography style={{ textAlign: "center", fontSize: 24 }}>
            {"Iniciar Sesión:"}
          </Typography>
          <EmailPasswordLogin goToRegistration={goToRegistration} />
        </div>
      </Grid>
      <Grid xs={12} item />
      <Grid item xs={5}>
        <div id="auth-button-container">
          <Typography style={{ textAlign: "center", fontSize: 24 }}>
            {"O continuar con tu cuenta de:"}
          </Typography>
          <GoogleButton />
          <FacebookButton />
        </div>
      </Grid>
    </>
  );
};

const FileUploader = ({
  onFileSelectError,
  onFileSelectSuccess,
  selectedFileName,
}) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file.size > 2200000) {
      onFileSelectError({ error: "File size cannot exceed more than 1MB" });
    } else onFileSelectSuccess(file);
  };

  return (
    <div className="file-uploader">
      <input
        accept="image/*"
        hidden
        ref={fileInput}
        type="file"
        onChange={handleFileInput}
      />
      <Button
        variant="contained"
        component="label"
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="btn btn-primary"
      >
        Select File
      </Button>
      <Typography>{selectedFileName}</Typography>
    </div>
  );
};

const RegistrationForm = ({ backToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const submitForm = () => {
    onEmailPasswordSignUp(name, email, password, selectedFile);
  };

  return (
    <div id="auth-button-container">
      <Typography style={{ textAlign: "center", fontSize: 24 }}>
        {"Registrarse:"}
      </Typography>
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
        <FileUploader
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({ error }) => alert(error)}
          selectedFileName={selectedFile?.name}
        />
      </div>

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

      <Typography style={{ textAlign: "center" }}>
        <Link
          component="button"
          variant="body2"
          onClick={backToLogin}
          sx={{ fontSize: 16 }}
        >
          {"Ya está registrado? Iniciar sesión!"}
        </Link>
      </Typography>
    </div>
  );
};

const AuthForms = () => {
  const [isRegistering, setIsRegistering] = useState(false);
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
          {isRegistering ? (
            <RegistrationForm backToLogin={() => setIsRegistering(false)} />
          ) : (
            <AuthButtons goToRegistration={() => setIsRegistering(true)} />
          )}
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

const styles = {
  text: { fontSize: 20 },
};
