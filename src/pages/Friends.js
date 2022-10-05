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
  CircularProgress,
  ListItemButton,
  TextField,
} from "@mui/material";
import ChatView from "../components/ChatView";

import { addDocToCollection } from "../firebase/utils/addDocToCollection";
import { getDocsToArray } from "../firebase/utils/getDocsToArray";
import { selectUser } from "../redux/auth";

import UserController from "../firebase/controllers/users";
import MessagesController from "../firebase/controllers/messages";
import { useSelector } from "react-redux";

const sendFriendRequest = async (email, user) => {
  const friendRequest = {
    from: user.email,
    to: email,
    status: "pending",
  };
  alert(`Se le ha enviado una solicitud de amistad a ${email}`);
  await addDocToCollection("friendRequests", friendRequest);
};

const getFriends = async (user) => {
  if (!user) return [];
  const friendRequests = await getDocsToArray("friendRequests");
  const users = await getDocsToArray("users");
  const friends = friendRequests.filter(
    (friendRequest) =>
      (friendRequest.from === user.email &&
        friendRequest.status === "accepted") ||
      (friendRequest.to === user.email && friendRequest.status === "accepted")
  );
  return friends.map((friend) => {
    const friendUser = users.find(
      (user) => user.email === friend.from || user.email === friend.to
    );
    if (friendUser) {
      return {
        email: friendUser.email,
        name: friendUser.name,
        id: friendUser.id,
        profile: friendUser.profilePicture,
      };
    }
  });
};

const AddFriend = () => {
  const [email, setEmail] = useState("");
  const user = useSelector(selectUser);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid alignSelf={"center"} item xs={2}>
        <Button
          onClick={() => {
            sendFriendRequest(email, user);
            setEmail("");
          }}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

const FriendList = ({ selectedFriend, onSelectFriend, friendList }) => {
  // const user = useSelector(selectUser);
  //   const [friends, setFriends] = useState([]);

  //   useEffect(() => {
  //     const getFriendsFromFirebase = async () => {
  //       const friends = await getFriends(user);
  //       setFriends(friends);
  //     };
  //     getFriendsFromFirebase();
  //   }, [user]);
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
                  <Avatar src={friend.profile}>
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
