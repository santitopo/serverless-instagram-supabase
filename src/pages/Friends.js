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
import { Button, ListItemButton, TextField } from "@mui/material";
import ChatView from "../components/ChatView";
import { addDocToCollection } from "../firebase/utils/addDocToCollection";
import { getDocsToArray } from "../firebase/utils/getDocsToArray";
import { deleteDocOnCollection } from "../firebase/utils/deleteDocOnCollection";
import { updateDocOnCollection } from "../firebase/utils/updateDocOnCollection";
import { selectUser } from "../redux/auth";
import { useSelector } from "react-redux";

const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";


const sendFriendRequest = async (email, user) => {
  const users = await getDocsToArray("users");
  const friendRequest = {
    from: user.email,
    to: email,
    status: "pending",
  };
  if (users.find((user) => user.email === email)) {
    alert(`Se le ha enviado una solicitud de amistad a ${email}`);
  } else {
    alert(`Se le ha enviado una solicitud al mail de ${email}`);
  }

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
      (user) => user.email === friend.to || user.email === friend.from
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

const acceptFriendRequest = async (friendRequest) => {
  await updateDocOnCollection("friendRequests", friendRequest.id, {
    status: "accepted",
  });
};

const rejectFriendRequest = async (friendRequest) => {
  await deleteDocOnCollection("friendRequests", friendRequest.id);
};

const getPendingFriendRequests = async (user) => {
  const friendRequests = await getDocsToArray("friendRequests");
  return friendRequests.filter(
    (friendRequest) =>
      (friendRequest.to === user.email && friendRequest.status === "pending") ||
      (friendRequest.from === user.email && friendRequest.status === "pending")
  );
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
          onClick={() => sendFriendRequest(email, user) && setEmail("")}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

const FriendList = ({ selectedFriend, onSelectConversation }) => {
  const user = useSelector(selectUser);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriendsFromFirebase = async () => {
      const friends = await getFriends(user);
      setFriends(friends);
    };
    getFriendsFromFirebase();
  }, [user]);

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Amigos
      </Typography>
      <div id="list-container">
        <List dense={false}>
          {friends.length
            ? friends.map((friend) => (
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
              ))
            : "Aun no tienes amigos."}
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
