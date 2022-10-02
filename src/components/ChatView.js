import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth";

const Message = ({
  selfMessage,
  body = "Conversación",
  from = "Santiago Topo",
  sentAt = "2020-02-21 14:40",
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
        {`${selfMessage ? "Tú" : from} : ${sentAt}`}
      </Typography>
    </Grid>
  );
};

const ChatView = ({ conversation }) => {
  const loggedInUser = useSelector(selectUser);
  return (
    <>
      <Grid
        alignItems={"flex-end"}
        container
        sx={{ height: 500, overflowY: "scroll" }}
      >
        <Grid
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
          item
          rowSpacing={2}
          container
          xs={12}
        >
          {conversation.map((message) => (
            <Message
              key={`${message.body}-${message.sentAt}-${message.from}`}
              selfMessage={message.sent_by === loggedInUser.uid}
              {...message}
            />
          ))}
        </Grid>
      </Grid>
      <Grid container alignItems={"center"} spacing={2} sx={{ padding: 1 }}>
        <Grid item xs={9}>
          <TextField
            color="primary"
            fullWidth
            label="Escriba su mensaje"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2} alignSelf={"center"}>
          <Button variant="contained" endIcon={<SendIcon />}>
            Enviar
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ChatView;
