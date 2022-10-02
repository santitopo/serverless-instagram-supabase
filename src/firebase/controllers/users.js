import setDocInCollection from "../utils/setDocInCollection";

class UserController {
  postUser(userData, uid) {
    return setDocInCollection("users", userData, uid);
  }
}

export default new UserController();
