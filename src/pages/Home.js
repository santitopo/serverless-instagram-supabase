import { Grid, Typography } from "@mui/material";
import * as React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import "./Home.css";
import { auth } from "..";
import { selectUser } from "../redux/auth";
import { useIsLoggedIn } from "../providers/Authentication";
import { useSelector } from "react-redux";

const provider = new GoogleAuthProvider();

const onGoogleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("user logged in", { user });
    })
    .catch((error) => {
      console.log("error logging in", { error });
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
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

export const GoogleButton = () => {
  return (
    <SSOProviderButton
      onPress={onGoogleSignIn}
      color={GOOGLE_RED}
      text={"Continuar con Google"}
      icon={require("../assets/google.png")}
    />
  );
};

export const FacebookButton = () => {
  return (
    <SSOProviderButton
      color={FACEBOOK_BLUE}
      text={"Continuar con Facebook"}
      icon={require("../assets/facebook.png")}
    />
  );
};

const AuthButtons = () => {
  return (
    <div id="auth-button-container">
      <Typography style={{ textAlign: "center", fontSize: 24 }}>
        {"Autenticación:"}
      </Typography>
      <GoogleButton />
      <FacebookButton />
    </div>
  );
};

const AuthForms = () => {
  return (
    <>
      <Grid
        sx={{ paddingX: 50, paddingY: 20 }}
        style={{ height: "100vh" }}
        container
        rowSpacing={3}
      >
        <Grid item xs={12}>
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
        {" "}
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
