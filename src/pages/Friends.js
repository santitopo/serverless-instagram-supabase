import "./Friends.css";
import React, { useEffect, useState } from "react";
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
  ListItemButton,
  TextField,
  useTheme,
} from "@mui/material";
import ChatView from "../components/ChatView";

import { addDocToCollection } from "../firebase/utils/addDocToCollection";
import { getDocFromFirestore } from "../firebase/utils/getDocFromFirestore";

import { selectUser } from "../redux/auth";

import UserController from "../firebase/controllers/users";
import MessagesController from "../firebase/controllers/messages";
import { useSelector } from "react-redux";
import Invitations from "./Invitations";

const sendFriendRequest = async (to, from) => {
  try {
    console.log("starting send request", to, from);
    const friendRequest = {
      from: from,
      to,
    };

    const createdRequest = await addDocToCollection(
      "friendRequests",
      friendRequest
    );

    const userRegisteredWithEmail = await getDocFromFirestore("users", to);
    if (!userRegisteredWithEmail) {
      const emailToAdd = {
        to,
        message: {
          subject: "Esto es una prueba!",
          html: `
          <h4>Invitacion de registro a la plataforma</h4>
          <p>Esta es una invitacion a unirse al Serverless Chat!</p> <br>
          <p>Haz click en este <a href=${process.env.REACT_APP_DOMAIN}/register?invitationId=${createdRequest.id}>link</a>
          para completar el registro</p>`,
        },
      };
      await addDocToCollection("emails", emailToAdd);
    }
  } catch (e) {
    console.log("error sending invite", e);
  }
  alert(`Se le ha enviado una solicitud de amistad a ${to}`);
};

const AddFriend = ({ friendList }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const loggedInUser = useSelector(selectUser);
  const theme = useTheme();

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = async () => {
    try {
      if (!isValidEmail(email)) {
        return setError("Email es invalido!");
      }
      const foundFriend = friendList?.find((friend) => friend.email === email);
      if (foundFriend) {
        return setError("Ya eres amigo de este usuario!");
      }
      await sendFriendRequest(email, loggedInUser?.email);
      setEmail("");
      setError(null);
    } catch (e) {
      console.log(e?.message);
      setError("Error enviando solicitud de amistad");
    }
  };

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
          error={!!error}
          label="Dirección de Email"
          InputProps={{
            type: "search",
          }}
          value={email}
          onChange={(event) => {
            setError(null);
            setEmail(event.target.value);
          }}
        />
        {error && (
          <Typography color={theme.palette.error.main}>{error}</Typography>
        )}
      </Grid>
      <Grid alignSelf={"center"} item xs={2}>
        <Button
          onClick={handleSubmit}
          disabled={!email || email === ""}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

const ReceivedInvitationList = ({
  selectedFriend,
  onSelectFriend,
  friendList,
}) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Solicitudes Recibidas
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
                  <Avatar src={friend.profilePicture}>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.name} secondary={friend.email} />
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
            <Typography>{"No tienes ningún amigo aún"}</Typography>
          </Box>
        )}
      </div>
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
                  <Avatar src={friend.profilePicture}>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.name} secondary={friend.email} />
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
            <Typography>{"No tienes ningún amigo aún"}</Typography>
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
      <AddFriend friendList={friendList} />
      <FriendList
        friendList={friendList}
        selectedFriend={selectedFriend}
        onSelectFriend={onSelectFriend}
      />
      <Invitations />
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
