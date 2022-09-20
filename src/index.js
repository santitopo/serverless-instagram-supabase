import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEQRNTnPfAkvFxCEXW0KteKbU3Feb4OvY",
  authDomain: "chat-serverless-89e6b.firebaseapp.com",
  projectId: "chat-serverless-89e6b",
  storageBucket: "chat-serverless-89e6b.appspot.com",
  messagingSenderId: "329953320793",
  appId: "1:329953320793:web:3eb49259572a636fd5b648",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App auth={auth} />
  </React.StrictMode>
);
