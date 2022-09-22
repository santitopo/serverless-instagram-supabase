import { default as React } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import Router from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Authentication from "./providers/Authentication";

const themeLight = createTheme({
  palette: {
    primary: {
      main: "#128C7E",
    },
    secondary: {
      main: "#075E54",
    },
    background: {
      default: "#FFFFFF",
    },
    error: {
      main: "#c0392b",
    },
  },
});

function App({ auth }) {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={themeLight}>
          <Provider store={store}>
            <Authentication>
              <CssBaseline />
              <Router />
            </Authentication>
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
