import { Navigate, Outlet, useRoutes } from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";
import Home from "./pages/Home";
import { useAuth, useIsLoggedIn } from "./providers/Authentication";

import VerifyEmail from "./pages/VerifyEmail";
import { useIsEmailVerified } from "./providers/Authentication";
import RegisterScreen from "./pages/RegisterScreen";
import ForgotPasswordScreen from "./pages/ForgotPassword";
import ResetPasswordScreen from "./pages/ResetPassword";
import CompleteRegistration from "./pages/CompleteRegistration";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import SearchUsers from "./pages/SearchUsers";

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
        { path: "/", element: <Navigate to="/feed" replace /> },
        { path: "*", element: <Navigate to="/feed" replace /> },
        {
          path: "feed",
          element: isLoggedIn ? (
            isEmailVerified ? (
              isProfileCompleted ? (
                <Feed />
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
            <Navigate to="/feed" replace />
          ) : (
            <ForgotPasswordScreen />
          ),
        },
        {
          path: "reset-password",
          element: isLoading ? null : isLoggedIn ? (
            <ResetPasswordScreen />
          ) : (
            <Navigate to="/feed" />
          ),
        },
        {
          path: "create-post",
          element: isLoading ? null : isLoggedIn ? (
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
            <Navigate to="/feed" />
          ),
        },
        {
          path: "profile",
          element: isLoading ? null : isLoggedIn ? (
            isEmailVerified ? (
              isProfileCompleted ? (
                <Profile />
              ) : (
                <Navigate to="/complete-register" replace />
              )
            ) : (
              <Navigate to="/verify-email" replace />
            )
          ) : (
            <Navigate to="/feed" />
          ),
        },
        {
          path: "search-users",
          element: isLoading ? null : isLoggedIn ? (
            isEmailVerified ? (
              isProfileCompleted ? (
                <SearchUsers />
              ) : (
                <Navigate to="/complete-register" replace />
              )
            ) : (
              <Navigate to="/verify-email" replace />
            )
          ) : (
            <Navigate to="/feed" />
          ),
        },
      ],
    },
  ]);
}
