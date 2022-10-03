import getDocFromFirestore from "../utils/getDocFromFirestore";
import setDocInCollection from "../utils/setDocInCollection";

class UserController {
  postUser(userData, uid) {
    return setDocInCollection("users", userData, uid);
  }
  getUserFriends(uid) {
    return getDocFromFirestore("users", uid);
  }
}

export default new UserController();
