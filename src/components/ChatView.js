import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

const Message = ({
  selfMessage,
  body = "Conversación",
  from = "Santiago Topo",
  sentAt = "2020-02-21 14:40",
}) => {
  return (
    <>
      <Typography
        style={{
          paddingBottom: 5,
          paddingTop: 5,
          paddingLeft: selfMessage ? "50%" : 5,
          paddingRight: selfMessage ? 5 : "50%",
          //backgroundColor: "green",
          textAlign: selfMessage ? "right" : "left",
        }}
      >
        {body}
      </Typography>

      <Typography
        fontSize={12}
        style={{
          paddingBottom: 5,
          paddingTop: 5,
          paddingLeft: selfMessage ? "50%" : 5,
          paddingRight: selfMessage ? 5 : "50%",
          textAlign: selfMessage ? "right" : "left",
        }}
      >
        {`${selfMessage ? "Tú" : from} : ${sentAt}`}
      </Typography>
    </>
  );
};

const ChatView = () => {
  return (
    <>
      <Grid
        alignItems={"flex-end"}
        container
        sx={{ height: 500, overflowY: "scroll" }}
      >
        <Grid
          style={{
            //backgroundColor: "red",
            paddingLeft: 10,
            paddingRight: 10,
          }}
          item
          xs={12}
        >
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            selfMessage
          />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
          <Message body="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
          <Message selfMessage />
          <Message />
          <Message selfMessage />
        </Grid>
      </Grid>
      <Grid container sx={{ padding: 1 }}>
        <Grid item xs={10}>
          <TextField fullWidth label="Escriba su mensaje" variant="standard" />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" endIcon={<SendIcon />}>
            Enviar
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ChatView;
