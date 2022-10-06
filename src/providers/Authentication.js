import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authCleared, authenticated, selectUser } from "../redux/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import UserController from "../firebase/controllers/users";

const Authentication = ({ children }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const messaging = getMessaging();
  const user = useSelector(selectUser);

  const fetchAndStoreToken = useCallback(
    async (userId) => {
      try {
        if (!messaging) {
          return;
        }
        const currentToken = await getToken(messaging, {
          vapidKey:
            "BP0PTKPZnTNk5SlrwF8nfXTEAmpZNVZulywBhiS9uDst1OWD81-gEi5vZOqCwA1XDRY0P5c4pAwPwDmwl0EqT8A",
        });

        if (currentToken) {
          UserController.registerNotificationToken(userId, currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      } catch (err) {
        return setTimeout(() => {
          alert(
            "Por favor otorgue permisos para notificaciones en la configuracion de su navegador."
          );
        }, 2000);
      }
    },
    [messaging]
  );

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const timer = fetchAndStoreToken(user.uid);
    return () => {
      timer && clearTimeout(timer);
    };
  }, [fetchAndStoreToken, user]);

  useEffect(() => {
    if (!auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        dispatch(
          authenticated({
            displayName: fbUser?.displayName,
            email: fbUser?.email,
            emailVerified: fbUser?.emailVerified,
            SSOProviderId: fbUser?.providerData[0].providerId,
            photoURL: fbUser?.photoURL,
            uid: fbUser?.uid,
          })
        );
      } else {
        dispatch(authCleared());
      }
    });

    return unsubscribe;
  }, [auth, dispatch]);

  return children;
};

export const useIsLoggedIn = () => {
  const user = useSelector(selectUser);
  return !!user;
};

export const useIsEmailVerified = () => {
  const user = useSelector(selectUser);

  return user && (user.emailVerified || user.SSOProviderId === "facebook.com");
};

export default Authentication;
