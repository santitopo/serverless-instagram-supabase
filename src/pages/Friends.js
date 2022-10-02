import "./Friends.css";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";

import SendIcon from "@mui/icons-material/Send";
import { Button, ListItemButton, TextField } from "@mui/material";
import ChatView from "../components/ChatView";

const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";

const fakeFriends = [
  { name: "Santiago Topo", profile: defaultProfile, id: 1 },
  { name: "Intro", profile: defaultProfile, id: 2 },
  { name: "Gio", profile: defaultProfile, id: 3 },
  { name: "Tommy", profile: defaultProfile, id: 4 },
];

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
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

const FriendList = ({ selectedFriend, onSelectConversation }) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Amigos
      </Typography>
      <div id="list-container">
        <List dense={false}>
          {fakeFriends.map((friend) => (
            <ListItemButton
              selected={selectedFriend?.id === friend.id}
              key={friend.id}
              onClick={() => {
                onSelectConversation(friend);
              }}
            >
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

const LeftContainer = ({ onSelectConversation, selectedFriend }) => {
  return (
    <Grid container item xs={6}>
      <AddFriend />
      <FriendList
        selectedFriend={selectedFriend}
        onSelectConversation={onSelectConversation}
      />
    </Grid>
  );
};

const Conversation = ({ selectedFriend }) => {
  return (
    <Grid item xs={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        {`Conversación con ${selectedFriend.name}`}
      </Typography>
      <div id="conversation-container">
        <ChatView />
      </div>
    </Grid>
  );
};

export default function FriendsSearch() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <Grid sx={{ paddingX: 5 }} alignItems={"flex-start"} container spacing={2}>
      <LeftContainer
        onSelectConversation={setSelectedFriend}
        selectedFriend={selectedFriend}
      />
      {selectedFriend && <Conversation selectedFriend={selectedFriend} />}
    </Grid>
  );
}
