import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { getAuth, signOut } from "firebase/auth";

import { Button, Typography, useTheme } from "@mui/material";
import { useIsEmailVerified, useIsLoggedIn } from "../providers/Authentication";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth";

const CustomAppBar = ({ title }) => {
  const auth = getAuth();
  const theme = useTheme();
  const isLoggedIn = useIsLoggedIn();
  const loggedInUser = useSelector(selectUser);

  const isEmailVerified = useIsEmailVerified();
  console.log("logged in user is", loggedInUser);

  return (
    <AppBar
      style={{ background: theme.palette.secondary }}
      position="sticky"
      open={true}
    >
      <Toolbar
        sx={{
          textAlign: "center",
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <Typography
          color={theme.palette.background}
          component="h1"
          variant="h6"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>

        {isLoggedIn && (
          <Typography
            color={theme.palette.background}
            component="h1"
            variant="h6"
            sx={{ mr: 1 }}
            noWrap
          >
            {loggedInUser?.displayName
              ? `Bienvenido, ${loggedInUser?.displayName}`
              : "Bienvenido!"}
          </Typography>
        )}

        {isLoggedIn && (
          <Button
            style={{ backgroundColor: "white" }}
            onClick={() => {
              signOut(auth)
                .then(() => {
                  console.log("logged out successfully");
                })
                .catch((error) => {
                  console.log("an error happened signing out", { error });
                });
            }}
          >
            {"Cerrar Sesión"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
