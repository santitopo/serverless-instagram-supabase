import "./Friends.css";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import { Button, ListItemButton } from "@mui/material";
import { getDocsToArray } from "../firebase/utils/getDocsToArray";
import { deleteDocOnCollection } from "../firebase/utils/deleteDocOnCollection";
import { updateDocOnCollection } from "../firebase/utils/updateDocOnCollection";
import { selectUser } from "../redux/auth";
import { useSelector } from "react-redux";

const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";

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
      friendRequest.to === user.email && friendRequest.status === "pending"
  );
};

const getUserFromPendingFriendRequest = async (friendRequest) => {
  const users = await getDocsToArray("users");
  return users.find((user) => user.email === friendRequest.from);
};

const FriendRequestsList = ({ user }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const getFriendRequests = async () => {
      const friendRequests = await getPendingFriendRequests(user);
      const users = await Promise.all(
        friendRequests.map((friendRequest) =>
          getUserFromPendingFriendRequest(friendRequest)
        )
      );
      const friendRequestsWithUsers = friendRequests.map(
        (friendRequest, index) => ({
          ...friendRequest,
          user: users[index],
        })
      );
      setFriendRequests(friendRequestsWithUsers);
    };
    getFriendRequests();
  }, [user]);

  useEffect(() => {
    if (friendRequests.length > 0) {
      const interval = setInterval(() => {
        const getFriendRequests = async () => {
          const friendRequests = await getPendingFriendRequests(user);
          const users = await Promise.all(
            friendRequests.map((friendRequest) =>
              getUserFromPendingFriendRequest(friendRequest)
            )
          );
          const friendRequestsWithUsers = friendRequests.map(
            (friendRequest, index) => ({
              ...friendRequest,
              user: users[index],
            })
          );
          setFriendRequests(friendRequestsWithUsers);
        };
        getFriendRequests();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [friendRequests, user]);

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 6, mb: 2 }} variant="h5" component="div">
        Invitaciones
      </Typography>
      <div id="list-container">
        <List dense={false}>
          {friendRequests.map((friendRequest) => (
            <ListItemButton key={friendRequest.id}>
              <ListItemAvatar>
                <Avatar
                  src={
                    friendRequest.user?.profilePicture
                      ? friendRequest.user.profilePicture
                      : defaultProfile
                  }
                >
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friendRequest.from}
                secondary={
                  friendRequest.status === "pending" ? "Pendiente" : ""
                }
              />
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  acceptFriendRequest(friendRequest) &&
                  setFriendRequests(
                    friendRequests.filter((fr) => fr.id !== friendRequest.id)
                  )
                }
              >
                Aceptar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  rejectFriendRequest(friendRequest) &&
                  setFriendRequests(
                    friendRequests.filter((fr) => fr.id !== friendRequest.id)
                  )
                }
              >
                Rechazar
              </Button>
            </ListItemButton>
          ))}
        </List>
      </div>
    </Grid>
  );
};

export default function Invitations() {
  const user = useSelector(selectUser);
  return (
    <div className="friendRequests">
      <FriendRequestsList user={user} />
    </div>
  );
}
