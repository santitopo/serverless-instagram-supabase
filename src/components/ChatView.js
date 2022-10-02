import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

const fakeConversation = [
  {
    body: "Mensaje de muestra",
    sentAt: "2020-02-21 14:40",
    from: "Santiago Topo",
    selfMessage: false,
  },
  {
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    sentAt: "2020-02-21 14:40",
    from: "Santiago Topo",
    selfMessage: true,
    imageUrl:
      "https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg",
  },
  {
    body: "Mensaje de muestra",
    sentAt: "2020-02-21 14:40",
    from: "Santiago Topo",
    selfMessage: true,
  },
  {
    body: "Mensaje de muestra",
    sentAt: "2020-02-21 14:40",
    from: "Santiago Topo",
    selfMessage: false,
  },
];

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
          rowSpacing={2}
          container
          xs={12}
        >
          {fakeConversation.map((message) => (
            <Message
              key={`${message.body}-${message.sentAt}-${message.from}`}
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
