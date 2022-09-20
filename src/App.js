import { default as React } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import Router from "./routes";

const themeLight = createTheme({
  palette: {
    primary: {
      main: "#128C7E",
    },
    secondary: {
      main: "#075E54",
    },
    background: {
      default: "white",
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={themeLight}>
          <CssBaseline />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
