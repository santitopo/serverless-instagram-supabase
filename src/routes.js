import { useState } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import ContainerWithDrawer from "./layouts/ContainerWithDrawer";
import ChatScreen from "./pages/ChatScreen";
import FriendsSearch from "./pages/Friends";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import { useIsEmailVerified, useIsLoggedIn } from "./providers/Authentication";

const titlesFromPath = {
  "/home": "Serverless Chat",
  "/friends": "Amigos",
  "/chats": "Conversaciones",
};

export default function Router(props) {
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const isEmailVerified = useIsEmailVerified();
  const location = useLocation();

  return useRoutes([
    {
      path: "/",

      element: (
        <>
          <CustomAppBar
            setIsOpened={setDrawerOpened}
            title={titlesFromPath[location?.pathname] || "Serverless Chat"}
            isLoggedIn={isLoggedIn}
          />
          <ContainerWithDrawer
            isOpened={isDrawerOpened}
            setIsOpened={setDrawerOpened}
          />
        </>
      ),
      children: [
        { path: "/", element: <Navigate to="/home" replace /> },
        {
          path: "home",
          element: <Home /> ,
        },
        {
          path: "friends",
          element: (isLoggedIn && isEmailVerified) ? <FriendsSearch /> : <VerifyEmail/>,
        },
        {
          path: "chats",
          element: (isLoggedIn && isEmailVerified) ? <ChatScreen /> : <VerifyEmail/>,
        },
      ],
    },
  ]);
}