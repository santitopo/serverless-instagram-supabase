import listenDocsToArray from "../utils/listenDocsToArray";

class ConversationsController {
  listenConversation(conversationId, callback) {
    return listenDocsToArray(
      `conversations/${conversationId}/messages`,
      callback,
      { field: "sent_at", direction: "asc" }
    );
  }
}

export default new ConversationsController();
