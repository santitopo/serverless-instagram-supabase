import { Navigate, Outlet, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import FriendsSearch from "./pages/Friends";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import { useIsEmailVerified, useIsLoggedIn } from "./providers/Authentication";

export default function Router(props) {
  const isLoggedIn = useIsLoggedIn();
  const isEmailVerified = useIsEmailVerified();

  return useRoutes([
    {
      path: "/",

      element: (
        <>
          <CustomAppBar title={"Serverless Chat"} isLoggedIn={isLoggedIn} />
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
      ],
    },
  ]);
}
