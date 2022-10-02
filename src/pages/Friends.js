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
import FriendController from "../firebase/controllers/friends";
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

const getFriendName = (relationship, loggedInUser) => {
  return relationship.user_1_id === loggedInUser.uid
    ? relationship.user_2_name
    : relationship.user_1_name;
};
const FriendList = ({ selectedFriend, onSelectConversation, friendList }) => {
  const loggedInUser = useSelector(selectUser);

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Amigos
      </Typography>
      <div id="list-container">
        {friendList && friendList?.length > 0 ? (
          <List dense={false}>
            {friendList.map((relationship) => (
              <ListItemButton
                selected={
                  selectedFriend?.id === relationship.user_1_id ||
                  selectedFriend?.id === relationship.user_2_id
                }
                key={relationship.id}
                onClick={() => {
                  onSelectConversation(relationship);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={defaultProfile}>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={getFriendName(relationship, loggedInUser)}
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

const LeftContainer = ({ onSelectConversation, selectedFriend }) => {
  const [friendList, setFriendList] = useState([]);
  //make listener here
  const suscribeToFriendsList = async () => {
    try {
      const res = await FriendController.getFriends();
      console.log("the res is ", res);
      setFriendList(res);
    } catch (e) {
      console.log("the error is ", e);
    }
  };

  useEffect(() => {
    console.log("running useEffect to suscribe to friends list");
    suscribeToFriendsList();
  }, []);

  return (
    <Grid container item xs={6}>
      <AddFriend />
      <FriendList
        friendList={friendList}
        selectedFriend={selectedFriend}
        onSelectConversation={onSelectConversation}
      />
    </Grid>
  );
};

const Conversation = ({ selectedRelationship }) => {
  const loggedInUser = useSelector(selectUser);
  return (
    <Grid item xs={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        {`Conversación con ${getFriendName(
          selectedRelationship,
          loggedInUser
        )}`}
      </Typography>
      <div id="conversation-container">
        <ChatView conversation={selectedRelationship.conversation} />
        {/* <ChatView conversation={fakeConversation} /> */}
      </div>
    </Grid>
  );
};

export default function FriendsSearch() {
  const [selectedRelationship, setSelectedFriend] = useState(null);

  return (
    <Grid sx={{ paddingX: 5 }} alignItems={"flex-start"} container spacing={2}>
      <LeftContainer
        onSelectConversation={setSelectedFriend}
        selectedFriend={selectedRelationship}
      />
      {selectedRelationship && (
        <Conversation selectedRelationship={selectedRelationship} />
      )}
    </Grid>
  );
}
