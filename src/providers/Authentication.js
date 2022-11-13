import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  authCleared,
  authenticated,
  selectIsLoading,
  selectUser,
} from "../redux/auth";
import { supabase } from "../supabase";

const Authentication = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("new session! ", session);
      if (session?.user) {
        dispatch(authenticated(session?.user));
      } else {
        dispatch(authCleared());
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("new session! ", session);
      if (session?.user) {
        dispatch(authenticated(session?.user));
      } else {
        dispatch(authCleared());
      }
    });
  }, [dispatch]);

  return children;
};

export const useIsLoggedIn = () => {
  const user = useSelector(selectUser);
  return !!user;
};

export const useIsEmailVerified = () => {
  const user = useSelector(selectUser);

  return user && user.email_confirmed_at;
};

export const useAuth = () => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  return {
    isLoggedIn: !!user,
    isProfileCompleted:
      user && user.username && user.full_name && user.avatar_url,
    isLoading,
    isEmailVerified: user && user.email_confirmed_at,
    user,
  };
};

export default Authentication;
