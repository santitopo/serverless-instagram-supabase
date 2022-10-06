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

  listenLastMessageOfConversation(conversationId, callback) {
    return listenDocsToArray(
      `conversations/${conversationId}/messages`,
      callback,
      { field: "sent_at", direction: "desc" },
      1
    );
  }

  async sendMessage(conversationId, messageData) {
    return addDocToCollection(
      `conversations/${conversationId}/messages`,
      messageData
    );
  }

  async createConversation(user1Id, user2Id) {
    const conversation = await addDocToCollection("conversations", {
      user_1_id: user1Id,
      user_2_id: user2Id,
    });
    return conversation;
  }
}

export default new MessagesController();
