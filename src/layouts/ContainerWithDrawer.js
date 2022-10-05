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
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "../providers/Authentication";

const loggedOutScreensList = [
  {
    name: "Inicio",
    screen: "/home",
    Icon: HomeIcon,
  },
];

const loggedInScreensList = [
  {
    name: "Inicio",
    screen: "/home",
    Icon: HomeIcon,
  },
  {
    name: "Amigos",
    screen: "/friends",
    Icon: GroupIcon,
  },
  {
    name: "Conversaciones",
    screen: "/chats",
    Icon: ChatIcon,
  },
  {
    name: "Invitaciones",
    screen: "/invitations",
    Icon: GroupIcon,
  }
];

const TemporaryDrawer = ({ isOpened, setIsOpened }) => {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const screensList = isLoggedIn ? loggedInScreensList : loggedOutScreensList;

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
