import {
  Box,
  Link,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import UserController from "../firebase/controllers/users";
import MessageController from "../firebase/controllers/messages";
import "./Home.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import FileUploader from "../components/FileUploader";
import { useNavigate, useSearchParams } from "react-router-dom";
import getDocFromFirestore from "../firebase/utils/getDocFromFirestore";
import deleteDocOnCollection from "../firebase/utils/deleteDocOnCollection";

const acceptFriendRequest = async (
  loggedInUser,
  friendThatInvitedMe,
  friendRequest
) => {
  try {
    console.log({ loggedInUser, friendThatInvitedMe, friendRequest });
    console.log("creating conversation between both");
    //1. create conversation between both users
    const conversation = await MessageController.createConversation(
      loggedInUser?.uid,
      friendThatInvitedMe?.id
    );
    console.log("adding mutual friendship");

    //2. Add friend to friend list in both users
    await UserController.addFriends(
      conversation.id,
      loggedInUser?.uid,
      friendThatInvitedMe?.id
    );

    console.log("removing firend request");
    //3. Remove friendRequest
    await deleteDocOnCollection("friendRequests", friendRequest.id);
  } catch (e) {
    console.log(e);
  }
};

const onEmailPasswordSignUp = async (
  auth,
  name,
  email,
  password,
  profilePicture,
  invitationId
) => {
  console.log({ name, email, password, profilePicture, invitationId });
  const storage = getStorage();
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const fbUser = userCredential.user;
      // Registered properly
      // Upload picture
      console.log("registered in auth correctly");
      const imageRef = ref(storage, `profilePictures/${fbUser.uid}.jpg`);
      await uploadBytes(imageRef, profilePicture);
      const url = await getDownloadURL(imageRef);
      console.log("uploaded pic correctly");
      // Register user in firestore
      console.log("registering in firestore");
      const user = await UserController.postUser(
        {
          name,
          email,
          profilePicture: url,
        },
        fbUser.uid
      );
      console.log("registered in firestore correctly");
      if (invitationId) {
        console.log("there was an invitation id");
        const invitation = await getDocFromFirestore(
          "friendRequests",
          invitationId
        );
        const friendThatInvitedMe = await UserController.getUserFromEmail(
          invitation?.from
        );
        console.log("fetched the invitation, it is", invitation);
        await acceptFriendRequest(fbUser, friendThatInvitedMe, {
          ...invitation,
          id: invitationId,
        });
      }
      console.log("will send email verification", userCredential.user);
      sendEmailVerification(userCredential.user);
      console.log("added", user);
    })
    .catch((e) => {
      console.log("error during registration...", e);
    });
};

const RegistrationForm = ({ invitationId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [generalError, setGeneralError] = useState("");
  const auth = getAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("hello", invitationId);
    if (invitationId) {
      console.log("gonna call");
      getDocFromFirestore("friendRequests", invitationId)
        .then((friendRequest) => {
          console.log("the friend request fetched is", friendRequest);
          if (!friendRequest) {
            throw new Error();
          }
          setEmail(friendRequest?.to);
        })
        .catch(() => {
          alert("Error aceptando la invitación");
        });
    }
  }, [invitationId]);

  const submitForm = async () => {
    try {
      await onEmailPasswordSignUp(
        auth,
        name,
        email,
        password,
        selectedFile,
        invitationId
      );
      navigate("/home");
    } catch {
      setGeneralError("Error registrando usuario");
    }
  };

  return (
    <div id="auth-button-container">
      <Typography style={{ textAlign: "center", fontSize: 24 }}>
        {"Registrarse:"}
      </Typography>
      <div id="text-field-container">
        <TextField
          fullWidth
          id="name-registration"
          label="Nombre Completo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div id="text-field-container">
        <TextField
          fullWidth
          id="email-registration"
          label="Correo Electrónico"
          variant="outlined"
          disabled={!!invitationId}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div id="text-field-container">
        <TextField
          fullWidth
          type={"password"}
          id="password-registration"
          label="Contraseña"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div id="text-field-container">
        <FileUploader
          text={"Seleccionar Foto"}
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({ error }) => alert(error)}
          selectedFileName={selectedFile?.name}
        />
      </div>
      {generalError && (
        <Typography
          color={theme.palette.error.main}
          style={{ textAlign: "center" }}
        >
          {generalError}
        </Typography>
      )}

      <Box sx={{ margin: 3 }} textAlign="center">
        <Button
          onClick={submitForm}
          variant="contained"
          component="label"
          className="btn btn-primary"
          disabled={!name || !email || !selectedFile}
        >
          Registrarse
        </Button>
      </Box>

      <Typography style={{ textAlign: "center" }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/home")}
          sx={{ fontSize: 16 }}
        >
          {"Ya está registrado? Iniciar sesión!"}
        </Link>
      </Typography>
    </div>
  );
};

export default function RegisterScreen() {
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  console.log("invitationId", invitationId);

  return (
    <Grid sx={{ paddingY: 20 }} style={{ height: "80vh" }} container>
      <Grid
        alignItems={"center"}
        justifyContent={"center"}
        container
        item
        spacing={3}
        xs={12}
      >
        <RegistrationForm invitationId={invitationId} />
      </Grid>
    </Grid>
  );
}
