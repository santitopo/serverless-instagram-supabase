import { Navigate, Outlet, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import FriendsSearch from "./pages/Friends";
import Home from "./pages/Home";
import { useIsLoggedIn } from "./providers/Authentication";

import VerifyEmail from "./pages/VerifyEmail";
import { useIsEmailVerified } from "./providers/Authentication";
import RegisterScreen from "./pages/RegisterScreen";

export default function Router() {
  const isLoggedIn = useIsLoggedIn();
  const isEmailVerified = useIsEmailVerified();

  return useRoutes([
    {
      path: "/",

      element: (
        <>
          <CustomAppBar title={"InstaOrt"} isLoggedIn={isLoggedIn} />
          <Outlet />
        </>
      ),
      children: [
        { path: "/", element: <Navigate to="/home" replace /> },
        { path: "*", element: <Navigate to="/home" replace /> },
        {
          path: "friends",
          element:
            !isEmailVerified || !isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <FriendsSearch />
            ),
        },
        {
          path: "home",
          element: isEmailVerified ? (
            <Navigate to="/friends" replace />
          ) : isLoggedIn ? (
            <VerifyEmail />
          ) : (
            <Home />
          ),
        },
        {
          path: "register",
          element: <RegisterScreen />,
        },
      ],
    },
  ]);
}
