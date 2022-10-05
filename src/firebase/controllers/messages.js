import listenDocsToArray from "../utils/listenDocsToArray";
import addDocToCollection from "../utils/addDocToCollection";

class MessagesController {
  listenConversation(conversationId, callback) {
    return listenDocsToArray(
      `conversations/${conversationId}/messages`,
      callback,
      { field: "sent_at", direction: "asc" }
    );
  }

  async sendMessage(conversationId, messageData) {
    return addDocToCollection(
      `conversations/${conversationId}/messages`,
      messageData
    );
  }
}

export default new MessagesController();
