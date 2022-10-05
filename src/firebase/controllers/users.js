import { where } from "firebase/firestore";
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

  addFriends(user1Id, user2Id) {
    //create conversation and get uid of conversation
    // update user 1
    // update user 2
    // return setDocInCollection(`users/${userId}/friends`, {
    //   conversation_id: 123,
    //   name: friend?.name,
    //   profilePicture: friend?.profilePicture,
    // });
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
