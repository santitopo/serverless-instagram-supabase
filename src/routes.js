import { useState } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import ContainerWithDrawer from "./layouts/ContainerWithDrawer";
import ChatScreen from "./pages/ChatScreen";
import FriendsSearch from "./pages/Friends";
import Invitations from "./pages/Invitations";
import Home from "./pages/Home";
import { useIsLoggedIn } from "./providers/Authentication";

const titlesFromPath = {
  "/home": "Serverless Chat",
  "/friends": "Amigos",
  "/chats": "Conversaciones",
  "/invitations": "Invitaciones",
};

export default function Router(props) {
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const isLoggedIn = useIsLoggedIn();
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
          element: <Home />,
        },
        {
          path: "friends",
          element: <FriendsSearch />,
        },
        {
          path: "chats",
          element: <ChatScreen />,
        },
        {
          path: "invitations",
          element: <Invitations />,
        },
      ],
    },
  ]);
}
