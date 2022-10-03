import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth, signOut } from "firebase/auth";

import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { useIsLoggedIn } from "../providers/Authentication";

const CustomAppBar = ({ title }) => {
  const auth = getAuth();
  const theme = useTheme();
  const isLoggedIn = useIsLoggedIn();

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
