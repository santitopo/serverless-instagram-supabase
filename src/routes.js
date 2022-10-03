import { Navigate, Outlet, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import FriendsSearch from "./pages/Friends";
import Home from "./pages/Home";
import { useIsLoggedIn } from "./providers/Authentication";

export default function Router(props) {
  const isLoggedIn = useIsLoggedIn();

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
          path: "home",
          element: isLoggedIn ? <FriendsSearch /> : <Home />,
        },
      ],
    },
  ]);
}
