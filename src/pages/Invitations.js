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
import { selectUser } from "../redux/auth";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import UserController from "../firebase/controllers/users";
const defaultProfile =
  "https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514531/77987158-dise%C3%B1o-gr%C3%A1fico-del-ejemplo-del-vector-del-icono-del-perfil-del-hombre-joven.jpg";

const acceptFriendRequest = async (friendRequest) => {
  console.log("entering acceptFriendRequest", friendRequest);
  try {
    //1. Add friend to friend list in both users
    //2. create conversation between both users
    //3. Remove friendRequest
    // await setDocInCollection(
    //   "friendRequests",
    //   {
    //     ...friendRequest,
    //     status: "accepted",
    //   },
    //   friendRequest.id
    // );
  } catch (e) {
    console.log(e);
  }
};

const rejectFriendRequest = async (friendRequest) => {
  await deleteDocOnCollection("friendRequests", friendRequest.id);
};

const getPendingFriendRequests = async (user) => {
  const friendRequests = await getDocsToArray("friendRequests");
  return friendRequests?.filter(
    (friendRequest) =>
      friendRequest?.to === user?.email && friendRequest?.status === "pending"
  );
};

const getUserFromPendingFriendRequest = async (friendRequest) => {
  const user = await UserController.getUserFromEmail(friendRequest?.to);
  console.log("found user", user);
  return user;
};

const FriendRequestsList = ({ user }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const getFriendRequests = async () => {
      const friendRequests = await getPendingFriendRequests(user);
      console.log(friendRequests);
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

  // useEffect(() => {
  //   let interval;
  //   if (friendRequests.length > 0) {
  //     interval = setInterval(() => {
  //       const getFriendRequests = async () => {
  //         const friendRequests = await getPendingFriendRequests(user);
  //         const users = await Promise.all(
  //           friendRequests.map((friendRequest) =>
  //             getUserFromPendingFriendRequest(friendRequest)
  //           )
  //         );
  //         const friendRequestsWithUsers = friendRequests.map(
  //           (friendRequest, index) => ({
  //             ...friendRequest,
  //             user: users[index],
  //           })
  //         );
  //         setFriendRequests(friendRequestsWithUsers);
  //       };
  //       getFriendRequests();
  //     }, 5000);
  //     return () => {
  //       interval && clearInterval(interval);
  //     };
  //   }
  // }, [friendRequests, user]);

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 6, mb: 2 }} variant="h5" component="div">
        Invitaciones
      </Typography>
      <div id="list-container">
        {friendRequests && friendRequests.length > 0 ? (
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
                  onClick={() => {
                    acceptFriendRequest(friendRequest);
                    setFriendRequests((prefriendRequests) =>
                      prefriendRequests?.filter(
                        (fr) => fr.id !== friendRequest.id
                      )
                    );
                  }}
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
        ) : (
          <Box
            sx={{
              display: "flex",
              margin: 5,
              justifyContent: "center",
            }}
          >
            <Typography>No hay Invitaciones</Typography>
          </Box>
        )}
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
