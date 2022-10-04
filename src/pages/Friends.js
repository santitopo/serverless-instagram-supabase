import "./Friends.css";
import React, { useCallback, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";

import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  ListItemButton,
  TextField,
} from "@mui/material";
import ChatView from "../components/ChatView";
import UserController from "../firebase/controllers/users";
import MessagesController from "../firebase/controllers/messages";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth";

const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";

const AddFriend = () => {
  return (
    <Grid container spacing={2} item xs={12}>
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
      <Grid alignSelf={"center"} item xs={2}>
        <Button variant="contained" endIcon={<SendIcon />}>
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

const FriendList = ({ selectedFriend, onSelectFriend, friendList }) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Amigos
      </Typography>
      <div id="list-container">
        {friendList && friendList?.length > 0 ? (
          <List dense={false}>
            {friendList.map((friend) => (
              <ListItemButton
                selected={selectedFriend?.uid === friend.id}
                key={friend.id}
                onClick={() => {
                  onSelectFriend(friend);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={defaultProfile}>
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
        ) : (
          <Box
            sx={{
              display: "flex",
              margin: 5,
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </div>
    </Grid>
  );
};

const LeftContainer = ({ onSelectFriend, selectedFriend }) => {
  const [friendList, setFriendList] = useState([]);
  const loggedInUser = useSelector(selectUser);

  useEffect(() => {
    if (!loggedInUser) return;
    const listener = UserController.listenUserFriends(
      loggedInUser.uid,
      setFriendList
    );
    return () => {
      listener && listener();
    };
  }, [loggedInUser]);

  return (
    <Grid container item xs={6}>
      <AddFriend />
      <FriendList
        friendList={friendList}
        selectedFriend={selectedFriend}
        onSelectFriend={onSelectFriend}
      />
    </Grid>
  );
};

const Conversation = ({ selectedFriend }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selectedFriend) {
      return;
    }

    const listener = MessagesController.listenConversation(
      selectedFriend?.conversation_id,
      setMessages
    );
    return () => {
      console.log("will unsuscribe");
      listener && listener();
    };
  }, [selectedFriend]);

  return (
    <Grid item xs={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        {`Conversación con ${selectedFriend.name}`}
      </Typography>
      <div id="conversation-container">
        <ChatView
          conversationId={selectedFriend?.conversation_id}
          messages={messages}
          friendName={selectedFriend.name}
        />
      </div>
    </Grid>
  );
};

export default function FriendsSearch() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <Grid sx={{ paddingX: 5 }} alignItems={"flex-start"} container spacing={2}>
      <LeftContainer
        onSelectFriend={setSelectedFriend}
        selectedFriend={selectedFriend}
      />
      {selectedFriend && <Conversation selectedFriend={selectedFriend} />}
    </Grid>
  );
}
