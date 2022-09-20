import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { Button, IconButton, Typography, useTheme } from "@mui/material";

const adaptAddress = (address) => {
  return `${address.substring(0, 5)}…${address.substring(address.length - 4)}`;
};

const CustomAppBar = ({ title, setIsOpened }) => {
  const theme = useTheme();
  const { connectWallet, disconnectWallet, userAddress } = {
    connectWallet: null,
    disconnectWallet: null,
    userAddress: null,
  };

  return (
    <AppBar
      style={{ background: theme.palette.secondary }}
      position="absolute"
      open={true}
    >
      <Toolbar
        sx={{
          textAlign: "center",
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setIsOpened((p) => !p)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          color={theme.palette.background}
          component="h1"
          variant="h6"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {userAddress && (
          <Button
            style={{ backgroundColor: theme.palette.background }}
            disabled={!!userAddress}
            onClick={connectWallet}
          >
            {"Logout"}
          </Button>
        )}

        {userAddress && (
          <Button
            style={{
              marginLeft: 10,
              backgroundColor: theme.palette.background,
            }}
            onClick={disconnectWallet}
          >
            {"Disconnect"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
