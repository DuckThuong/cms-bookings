import { SOCKET_EVENTS } from "../socket-events";
import { socketManager } from "../socket-manager";
import type {
  ConversationUpdatedEvent,
  MessageSentEvent,
  MessageStatusUpdatedEvent,
  ReadMessageSocketPayload,
  SendMessageSocketPayload,
} from "../socket-types";

const buildRequestId = () =>
  `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const chatSocket = {
  async joinConversation(conversationId: number) {
    await socketManager.trackRequest(
      `conversation:${conversationId}`,
      SOCKET_EVENTS.join,
      { conversationId },
    );
  },

  async leaveConversation(conversationId: number) {
    await socketManager.untrackRequest(
      `conversation:${conversationId}`,
      SOCKET_EVENTS.leave,
      { conversationId },
    );
  },

  async sendMessage(payload: SendMessageSocketPayload) {
    const response = await socketManager.emit<
      SendMessageSocketPayload,
      MessageSentEvent["data"]
    >(SOCKET_EVENTS.sendMessage, {
      ...payload,
      requestId: payload.requestId ?? buildRequestId(),
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to send message");
    }

    return response.data;
  },

  async markConversationAsRead(payload: ReadMessageSocketPayload) {
    const response = await socketManager.emit<ReadMessageSocketPayload, null>(
      SOCKET_EVENTS.readMessage,
      {
        ...payload,
        requestId: payload.requestId ?? buildRequestId(),
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to mark conversation as read");
    }
  },

  subscribeMessageSent(handler: (event: MessageSentEvent) => void) {
    return socketManager.subscribe<MessageSentEvent>(
      SOCKET_EVENTS.messageSent,
      handler,
    );
  },

  subscribeConversationUpdated(
    handler: (event: ConversationUpdatedEvent) => void,
  ) {
    return socketManager.subscribe<ConversationUpdatedEvent>(
      SOCKET_EVENTS.conversationUpdated,
      handler,
    );
  },

  subscribeMessageStatusUpdated(
    handler: (event: MessageStatusUpdatedEvent) => void,
  ) {
    return socketManager.subscribe<MessageStatusUpdatedEvent>(
      SOCKET_EVENTS.messageStatusUpdated,
      handler,
    );
  },
};
