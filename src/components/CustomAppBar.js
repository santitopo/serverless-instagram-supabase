import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { Button, IconButton, Typography } from "@mui/material";

const adaptAddress = (address) => {
  return `${address.substring(0, 5)}…${address.substring(address.length - 4)}`;
};

const CustomAppBar = ({ title, setIsOpened }) => {
  const { connectWallet, disconnectWallet, userAddress } = {
    connectWallet: null,
    disconnectWallet: null,
    userAddress: null,
  };

  return (
    <AppBar style={{ background: "#075E54" }} position="absolute" open={true}>
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
        <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {userAddress && (
          <Button
            style={{ backgroundColor: "white" }}
            disabled={!!userAddress}
            onClick={connectWallet}
          >
            {"Logout"}
          </Button>
        )}

        {userAddress && (
          <Button
            style={{ marginLeft: 10, backgroundColor: "white" }}
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
