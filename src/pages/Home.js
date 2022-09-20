import { Container, Grid, Typography } from "@mui/material";
import * as React from "react";
import CustomAppBar from "../components/CustomAppBar";
import "./Home.css";

const GOOGLE_RED = "#F65654";
const FACEBOOK_BLUE = "#1273EB";

const SSOProviderButton = ({ color, icon, text, onPress }) => {
  return (
    <>
      <div
        onClick={() => console.log("something")}
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

const Body = () => {
  return (
    <>
      <Grid
        sx={{ paddingX: 80, paddingY: 20 }}
        style={{ height: "100vh" }}
        container
        rowSpacing={3}
      >
        {/* <Grid item xs={12}  sx={{paddingX:4}}/> */}
        <Grid item xs={12}>
          {true ? (
            <AuthButtons />
          ) : (
            <Typography fontSize={24} style={{ textAlign: "center" }}>
              {`Welcome ${"Santiago"}! Start chatting now!`}
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default function Home({ setIsOpened }) {
  return (
    <>
      <CustomAppBar setIsOpened={setIsOpened} title={"Serverless Chat"} />
      <Body />
    </>
  );
}

const styles = {
  text: { fontSize: 20 },
};
