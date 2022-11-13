import { Navigate, Outlet, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import FriendsSearch from "./pages/Friends";
import Home from "./pages/Home";
import { useAuth, useIsLoggedIn } from "./providers/Authentication";

import VerifyEmail from "./pages/VerifyEmail";
import { useIsEmailVerified } from "./providers/Authentication";
import RegisterScreen from "./pages/RegisterScreen";
import ForgotPasswordScreen from "./pages/ForgotPassword";
import ResetPasswordScreen from "./pages/ResetPassword";
import CompleteRegistration from "./pages/CompleteRegistration";
import CreatePost from "./pages/CreatePost";

export default function Router() {
  const isLoggedIn = useIsLoggedIn();
  const isEmailVerified = useIsEmailVerified();
  const { isLoading, isProfileCompleted } = useAuth();

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
          element: isLoggedIn ? (
            isEmailVerified ? (
              isProfileCompleted ? (
                <Navigate to="/friends" replace />
              ) : (
                <CompleteRegistration />
              )
            ) : (
              <VerifyEmail />
            )
          ) : (
            <Home />
          ),
        },
        {
          path: "complete-register",
          element: <CompleteRegistration />,
        },
        {
          path: "register",
          element: <RegisterScreen />,
        },
        {
          path: "forgot-password",
          element: isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <ForgotPasswordScreen />
          ),
        },
        {
          path: "reset-password",
          element: isLoading ? null : isLoggedIn ? (
            <ResetPasswordScreen />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "create-post",
          element: isLoggedIn ? (
            isEmailVerified ? (
              isProfileCompleted ? (
                <CreatePost />
              ) : (
                <Navigate to="/complete-register" replace />
              )
            ) : (
              <Navigate to="/verify-email" replace />
            )
          ) : (
            <CreatePost/> //TODO: see why it only goes to default route (home) even if previous elements are true
          ),
        },
      ],
    },
  ]);
}
