import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { Button, Typography, useTheme, Link } from "@mui/material";
import { useIsLoggedIn } from "../providers/Authentication";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const CustomAppBar = ({ title }) => {
  const theme = useTheme();
  const isLoggedIn = useIsLoggedIn();
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();
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
        {isLoggedIn && (
          <Button
            style={{ backgroundColor: "white", paddingLeft: "10px" }}
            onClick={() => navigate("/feed")}
            sx={{ fontSize: 16 }}
          >
            {"Home"}
          </Button>
        )}
        <Typography style={{ textAlign: "center" }}></Typography>
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
          <Typography style={{ textAlign: "center", paddingLeft: "10px" }}>
            <Button
              style={{ backgroundColor: "white", paddingLeft: "10px" }}
              onClick={() => navigate("/search-users")}
              sx={{ fontSize: 16 }}
            >
              {"Buscar Usuarios"}
            </Button>
          </Typography>
        )}

        {isLoggedIn && (
          <Typography style={{ textAlign: "center", paddingLeft: "10px" }}>
            <Button
              style={{ backgroundColor: "white", paddingLeft: "10px" }}
              onClick={() => navigate("/create-post")}
              sx={{ fontSize: 16 }}
            >
              {"Crear post"}
            </Button>
          </Typography>
        )}
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
          <Typography style={{ textAlign: "center", paddingLeft: "10px" }}>
            <Button
              style={{ backgroundColor: "white", paddingLeft: "10px" }}
              onClick={() =>
                navigate(`/profile?username=${loggedInUser?.username}`)
              }
              sx={{ fontSize: 16 }}
            >
              {"Mi Perfil"}
            </Button>
          </Typography>
        )}
        {isLoggedIn && (
          <Button
            style={{ backgroundColor: "white" }}
            onClick={async () => {
              try {
                await supabase.auth.signOut();
              } catch (e) {
                console.log("an error happened signing out", e);
              }
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
