import "./Friends.css";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";

import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, ListItemButton, TextField, useTheme } from "@mui/material";

const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";

const fakeFriends = [
  { name: "Santiago Topo", profile: defaultProfile, id: 1 },
  { name: "Intro", profile: defaultProfile, id: 2 },
  { name: "Gio", profile: defaultProfile, id: 3 },
  { name: "Tommy", profile: defaultProfile, id: 4 },
];

const InvitationBar = () => {
  return (
    <div id="search-container">
      <TextField
        label="Search input"
        InputProps={{
          type: "search",
        }}
      />
    </div>
  );
};

const AddFriend = () => {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography sx={{ mt: 4 }} variant="h6" component="div">
          Agregar Amigo
        </Typography>
      </Grid>
      <Grid alignSelf={"center"} item xs={8}>
        <TextField
          fullWidth
          label="Dirección de Email"
          InputProps={{
            type: "search",
          }}
        />
      </Grid>
      <Grid alignSelf={"center"} item xs={4}>
        <Button sx={{ ml: 8 }} variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

const FriendList = () => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Amigos
      </Typography>
      <div id="list-container">
        <List dense={false}>
          {fakeFriends.map((friend) => (
            <ListItemButton key={friend.id}>
              <ListItemAvatar>
                <Avatar src={friend.profile}>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                secondary={true ? "Secondary text" : null}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
    </Grid>
  );
};

const LeftContainer = () => {
  return (
    <Grid container item xs={6}>
      <AddFriend />
      <FriendList />
    </Grid>
  );
};
const Conversation = () => {
  return (
    <Grid item xs={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Conversación
      </Typography>
      <div id="conversation-container">
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Here should go the chat
        </Typography>
      </div>
    </Grid>
  );
};

export default function FriendsSearch() {
  return (
    <Grid sx={{ paddingX: 5 }} style={{ height: "80vh" }} container spacing={2}>
      <LeftContainer />
      <Conversation />
    </Grid>
  );
}
