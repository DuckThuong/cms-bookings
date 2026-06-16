import { ROUTER_PATH } from "@/routers/Route";

export const CHAT_API_PATH = {
  CONVERSATIONS: "/chat/conversations",
  CONVERSATION: (id: number | string) => `/chat/conversations/${id}`,
  CONVERSATION_MESSAGES: (id: number | string) =>
    `/chat/conversations/${id}/messages`,
  CONVERSATION_MUTE: (id: number | string) =>
    `/chat/conversations/${id}/mute`,
  CONVERSATION_PIN: (id: number | string) =>
    `/chat/conversations/${id}/pin`,
  CONVERSATION_NICKNAME: (id: number | string) =>
    `/chat/conversations/${id}/nickname`,
  CONVERSATION_ASSIGN: (id: number | string) =>
    `/chat/conversations/${id}/assign`,
  CONVERSATION_STATUS: (id: number | string) =>
    `/chat/conversations/${id}/status`,
  OPERATORS: "/chat/operators",
  UPLOAD: "/upload/image",
};

export const ConverationEndpoint = {
  GET_CHAT_CONVERSATION: "chat-conversations",
  GET_CHAT_CONVERSATION_DETAIL: "chat-conversation-detail",
  GET_CHAT_OPERATORS: "chat-operators",
};

export const CHAT_QUERY_KEYS = {
  CONVERSATIONS: [ConverationEndpoint.GET_CHAT_CONVERSATION],
  CONVERSATION_DETAIL: (id: number) => [
    ConverationEndpoint.GET_CHAT_CONVERSATION_DETAIL,
    id,
  ],
  CONVERSATION_MESSAGES: (id: number) => [
    "chat-conversation-messages",
    id,
  ],
  OPERATORS: [ConverationEndpoint.GET_CHAT_OPERATORS],
};

export const CHAT_ROUTER_PATH = {
  CHAT: ROUTER_PATH.CHAT ?? "/chat",
};
