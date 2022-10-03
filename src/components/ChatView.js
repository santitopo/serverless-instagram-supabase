import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth";
import { Box } from "@mui/system";
import MessagesController from "../firebase/controllers/messages";
import { Timestamp } from "firebase/firestore";
import FileUploader from "./FileUploader";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Message = ({
  selfMessage,
  body = "Conversación",
  from = "Santiago Topo",
  sent_at,
  imageUrl,
}) => {
  return (
    <Grid
      item
      xs={12}
      sx={{
        paddingLeft: selfMessage ? "50%" : 0,
        paddingRight: selfMessage ? 0 : "50%",
      }}
    >
      <Typography
        style={{
          paddingBottom: 5,
          paddingTop: 5,
          textAlign: selfMessage ? "right" : "left",
        }}
      >
        {body}
      </Typography>
      {imageUrl && (
        <div style={{ textAlign: selfMessage ? "right" : "left" }}>
          <a href={imageUrl} target="_blank" rel="noreferrer">
            <img
              alt="Attachment"
              src={imageUrl}
              style={{
                maxWidth: "40%",
                maxHeight: 200,
                objectFit: "contain",
                paddingBottom: 5,
                paddingTop: 5,
              }}
            />
          </a>
        </div>
      )}
      <Typography
        fontSize={12}
        style={{
          paddingBottom: 5,
          paddingTop: 5,
          textAlign: selfMessage ? "right" : "left",
        }}
      >
        {`${selfMessage ? "Tú" : from} : ${sent_at?.toDate().toLocaleString()}`}
      </Typography>
    </Grid>
  );
};

const onSendMessage = async (conversationId, message, sentBy, selectedFile) => {
  try {
    const storage = getStorage();

    let imageUrl = "";
    if (selectedFile) {
      const randomId = uuidv4();
      const imageRef = ref(storage, `messages/${sentBy}/${randomId}.jpg`);
      await uploadBytes(imageRef, selectedFile);
      imageUrl = await getDownloadURL(imageRef);
      console.log("finished uploading picture", imageUrl);
    }
    return MessagesController.sendMessage(conversationId, {
      body: message,
      sent_by: sentBy,
      sent_at: Timestamp.now(),
      imageUrl,
    });
  } catch (err) {
    console.log(err);
  }
};

const ChatView = ({ messages, conversationId, friendName }) => {
  const loggedInUser = useSelector(selectUser);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const bottomRef = useRef(null);

  const handleMessageSending = () => {
    console.log("Sending message: ", message);
    onSendMessage(conversationId, message, loggedInUser.uid, selectedFile);
    setMessage("");
    setSelectedFile("");
  };

  useEffect(() => {
    messages?.length > 0 &&
      bottomRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
  }, [messages]);

  return (
    <>
      <Grid container sx={{ height: 500, overflowY: "scroll" }}>
        <Grid
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
          item
          container
          xs={12}
        >
          {messages ? (
            <Box ref={bottomRef} style={{ width: "100%" }}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <Message
                    key={`${message.body}-${message.sentAt}-${message.from}`}
                    selfMessage={message.sent_by === loggedInUser.uid}
                    {...message}
                  />
                ))
              ) : (
                <Typography
                  align="center"
                  variant="h8"
                  style={{ textAlign: "center" }}
                  color={"gray"}
                >{`Aún no tienes mensajes con ${friendName}!`}</Typography>
              )}
            </Box>
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
        </Grid>
      </Grid>
      <Grid container alignItems={"center"} spacing={2} sx={{ padding: 1 }}>
        <Grid item xs={9}>
          <TextField
            color="primary"
            fullWidth
            label="Escriba su mensaje"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} alignSelf={"center"}>
          <Button
            onClick={handleMessageSending}
            disabled={!message}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
          <div id="text-field-container">
            <FileUploader
              text={"Adjuntar"}
              onFileSelectSuccess={(file) => setSelectedFile(file)}
              onFileSelectError={({ error }) => alert(error)}
              selectedFileName={selectedFile?.name}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default ChatView;
