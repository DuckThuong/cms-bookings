import axiosClient from "../axiosClient";
import { CHAT_API_PATH } from "../endpoints/chat.endpoint";
import type {
  AssignConversationPayload,
  ConversationFilter,
  ConversationResponseDto,
  CreateConversationPayload,
  MessageResponseDto,
  MuteConversationPreset,
  NicknameConversationPayload,
  PaginatedMessagesDto,
  PinConversationPayload,
  SendMessagePayload,
  UpdateConversationStatusPayload,
} from "../dtos/chat.dto";

// ─── Conversations ────────────────────────────────────────────────────────
export const getChatConversations = async (
  filter?: ConversationFilter,
): Promise<ConversationResponseDto[]> => {
  const { data } = await axiosClient.get<ConversationResponseDto[]>(
    CHAT_API_PATH.CONVERSATIONS,
    { params: { filter } },
  );
  return data;
};

export const getChatConversationDetail = async (
  id: number,
): Promise<ConversationResponseDto | null> => {
  const { data } = await axiosClient.get<ConversationResponseDto>(
    CHAT_API_PATH.CONVERSATION(id),
  );
  return data;
};

// ─── Messages ───────────────────────────────────────────────────────────
export const getConversationMessages = async (
  conversationId: number,
  pagination?: { page?: number; limit?: number },
): Promise<MessageResponseDto[]> => {
  const { data } = await axiosClient.get<PaginatedMessagesDto>(
    CHAT_API_PATH.CONVERSATION_MESSAGES(conversationId),
    { params: pagination },
  );
  return data.data;
};

export const sendChatMessage = async (
  payload: SendMessagePayload,
): Promise<MessageResponseDto> => {
  const { data } = await axiosClient.post<MessageResponseDto>(
    CHAT_API_PATH.CONVERSATIONS.replace("/conversations", "") + "/messages",
    payload,
  );
  return data;
};

export const createChatConversation = async (
  payload: CreateConversationPayload,
): Promise<ConversationResponseDto> => {
  const { data } = await axiosClient.post<ConversationResponseDto>(
    CHAT_API_PATH.CONVERSATIONS,
    payload,
  );
  return data;
};

// ─── Conversation actions ─────────────────────────────────────────────────
export const muteConversation = async (payload: {
  conversationId: number;
  preset: MuteConversationPreset["preset"];
}): Promise<void> => {
  await axiosClient.post(CHAT_API_PATH.CONVERSATION_MUTE(payload.conversationId), {
    preset: payload.preset,
  });
};

export const pinConversation = async (
  payload: PinConversationPayload,
): Promise<void> => {
  await axiosClient.post(CHAT_API_PATH.CONVERSATION_PIN(payload.conversationId), {
    isPinned: payload.isPinned,
  });
};

export const setConversationNickname = async (
  payload: NicknameConversationPayload,
): Promise<void> => {
  await axiosClient.post(
    CHAT_API_PATH.CONVERSATION_NICKNAME(payload.conversationId),
    { nickname: payload.nickname },
  );
};

export const assignConversation = async (
  payload: AssignConversationPayload,
): Promise<void> => {
  await axiosClient.post(
    CHAT_API_PATH.CONVERSATION_ASSIGN(payload.conversationId),
    { assigneeId: payload.assigneeId },
  );
};

export const updateConversationStatus = async (
  payload: UpdateConversationStatusPayload,
): Promise<void> => {
  await axiosClient.post(
    CHAT_API_PATH.CONVERSATION_STATUS(payload.conversationId),
    { status: payload.status, priority: payload.priority },
  );
};

export const markConversationAsRead = async (
  conversationId: number,
  lastMessageId: number,
): Promise<void> => {
  await axiosClient.post(
    `${CHAT_API_PATH.CONVERSATION(conversationId)}/read`,
    { lastMessageId },
  );
};

// ─── Hotlines ───────────────────────────────────────────────────────────
export const getOperatorHotlines = async (): Promise<
  ConversationResponseDto[]
> => {
  const { data } = await axiosClient.get<ConversationResponseDto[]>(
    CHAT_API_PATH.OPERATORS,
  );
  return data;
};

export type { ConversationFilter, SendMessagePayload };
