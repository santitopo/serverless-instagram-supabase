import addDocToCollection from "../utils/addDocToCollection";

class UserController {
  postUser(userData) {
    return addDocToCollection("users", userData);
  }
}

export default new UserController();
