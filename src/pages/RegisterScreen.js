import {
  Box,
  Link,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
  CircularProgress,
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
    //1. create conversation between both users
    const conversation = await MessageController.createConversation(
      loggedInUser?.uid,
      friendThatInvitedMe?.id
    );

    //2. Add friend to friend list in both users
    await UserController.addFriends(
      conversation.id,
      loggedInUser?.uid,
      friendThatInvitedMe?.id
    );

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
  const storage = getStorage();
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const fbUser = userCredential.user;
      // Registered properly
      // Upload picture
      const imageRef = ref(storage, `profilePictures/${fbUser.uid}.jpg`);
      await uploadBytes(imageRef, profilePicture);
      const url = await getDownloadURL(imageRef);
      // Register user in firestore
      const user = await UserController.postUser(
        {
          name,
          email,
          profilePicture: url,
        },
        fbUser.uid
      );
      if (invitationId) {
        const invitation = await getDocFromFirestore(
          "friendRequests",
          invitationId
        );
        const friendThatInvitedMe = await UserController.getUserFromEmail(
          invitation?.from
        );
        await acceptFriendRequest(fbUser, friendThatInvitedMe, {
          ...invitation,
          id: invitationId,
        });
      }
      sendEmailVerification(userCredential.user);
    })
    .catch((e) => {
      console.log("error during registration...", e);
    });
};

const RegistrationForm = ({ invitationId }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (invitationId) {
      getDocFromFirestore("friendRequests", invitationId)
        .then((friendRequest) => {
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
      setIsLoading(true);
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
      setIsLoading(false);
      setGeneralError("Error registrando usuario");
    }
  };

  return (
    <Grid item xs={5}>
      <div id="auth-button-container">
        <Typography style={{ textAlign: "center", fontSize: 24 }}>
          {"Registrarse:"}
        </Typography>
        <div id="text-field-container">
          <TextField
            fullWidth
            label="Nombre de Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
          <Box sx={{ margin: 3 }} textAlign="center">
            <FileUploader
              text={"Seleccionar Foto"}
              onFileSelectSuccess={(file) => setSelectedFile(file)}
              onFileSelectError={({ error }) => alert(error)}
              selectedFileName={selectedFile?.name}
            />
          </Box>
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
        {isLoading && (
          <Box sx={{ margin: 3 }} textAlign="center">
            <CircularProgress />
          </Box>
        )}

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
    </Grid>
  );
};

export default function RegisterScreen() {
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitationId");

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
