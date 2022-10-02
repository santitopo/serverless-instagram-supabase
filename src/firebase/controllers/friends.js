import getDocsToArray from "../utils/getDocsToArray";

class FriendController {
  getFriends() {
    return getDocsToArray("friends");
  }
}

export default new FriendController();
