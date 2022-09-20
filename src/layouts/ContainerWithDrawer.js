import { Outlet } from "react-router-dom";
import * as React from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { ListItemIcon } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const screensList = [
  {
    name: "Home",
    screen: "/home",
    Icon: HomeIcon,
  },
  // {
  //   name: "Loan Contract",
  //   screen: "/loancontract",
  //   Icon: AccountBalanceWalletIcon,
  // },
];

const TemporaryDrawer = ({ isOpened, setIsOpened }) => {
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpened(open);
  };
  return (
    <Box>
      <Drawer anchor={"left"} open={isOpened} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 400 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {screensList.map(({ name, screen, Icon }, index) => (
              <ListItem key={name} disablePadding>
                <ListItemButton
                  onClick={() => navigate(screen, { replace: true })}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default function ContainerWithDrawer({ isOpened, setIsOpened }) {
  return (
    <>
      <TemporaryDrawer isOpened={isOpened} setIsOpened={setIsOpened} />
      <Outlet />
    </>
  );
}
