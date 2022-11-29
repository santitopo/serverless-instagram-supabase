/* eslint-disable jsx-a11y/anchor-is-valid */
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
        {isLoggedIn && (
          <Typography
            style={{ textAlign: "center", padding: "0px 10px 0px 10px" }}
          >
            <Button
              style={{ backgroundColor: "white" }}
              onClick={() => navigate("/rankings")}
              sx={{ fontSize: 16 }}
            >
              {"Rankings"}
            </Button>
          </Typography>
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
          <Typography
            style={{ textAlign: "center", padding: "0px 10px 0px 10px" }}
          >
            <Button
              style={{ backgroundColor: "white" }}
              onClick={() => navigate("/create-post")}
              sx={{ fontSize: 16 }}
            >
              {"Crear post"}
            </Button>
          </Typography>
        )}
        {isLoggedIn && (
          <a
            style={{ cursor: "pointer" }}
            alt="Your profile"
            onClick={() =>
              navigate(`/profile?username=${loggedInUser?.username}`)
            }
          >
            <Typography
              color={theme.palette.background}
              component="h1"
              variant="h6"
              style={{ textDecoration: "underline" }}
              sx={{ mr: 1 }}
              noWrap
            >
              {loggedInUser?.full_name
                ? `Bienvenido, ${loggedInUser?.full_name}`
                : "Bienvenido!"}
            </Typography>
          </a>
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
