export const SOCKET_EVENTS = {
  join: "chat.join",
  leave: "chat.leave",
  sendMessage: "chat.message.send",
  readMessage: "chat.message.read",
  messageSent: "chat.message.sent",
  messageStatusUpdated: "chat.message.status.updated",
  conversationUpdated: "chat.conversation.updated",
} as const;
