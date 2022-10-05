import { where } from "firebase/firestore";
import getDocFromFirestore from "../utils/getDocFromFirestore";
import listenDocsToArray from "../utils/listenDocsToArray";
import queryDocsFromFirestore from "../utils/queryDocsFromFirestore";
import setDocInCollection from "../utils/setDocInCollection";

class UserController {
  postUser(userData, uid) {
    return setDocInCollection("users", userData, uid);
  }
  listenUserFriends(userId, callback) {
    return listenDocsToArray(`users/${userId}/friends`, callback);
  }

  async registerNotificationToken(userId, token) {
    const user = await getDocFromFirestore("users", userId);
    if (!user) {
      return;
    }
    return setDocInCollection(
      "users",
      { ...user, notificationToken: token },
      userId
    );
  }

  async addFriends(conversationId, user1Id, user2Id) {
    // update user 1
    const user1 = await getDocFromFirestore("users", user1Id);
    const user2 = await getDocFromFirestore("users", user2Id);
    await setDocInCollection(
      `users/${user1Id}/friends`,
      {
        conversation_id: conversationId,
        email: user2.email,
        profilePicture: user2.profilePicture,
        name: user2.name,
      },
      user2Id
    );
    // update user 2
    await setDocInCollection(
      `users/${user2Id}/friends`,
      {
        conversation_id: conversationId,
        email: user1.email,
        profilePicture: user1.profilePicture,
        name: user1.name,
      },
      user1Id
    );
  }

  async getUserFromEmail(email) {
    const ret = await queryDocsFromFirestore(
      "users",
      where("email", "==", email)
    );
    console.log("ret", ret);
    return ret?.[0];
  }
}

export default new UserController();
