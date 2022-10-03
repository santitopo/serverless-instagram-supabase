import listenDocsToArray from "../utils/listenDocsToArray";
import setDocInCollection from "../utils/setDocInCollection";

class UserController {
  postUser(userData, uid) {
    return setDocInCollection("users", userData, uid);
  }
  listenUserFriends(userId, callback) {
    return listenDocsToArray(`users/${userId}/friends`, callback);
  }
}

export default new UserController();
