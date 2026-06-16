import axiosClient from "../axiosClient";
import { CHAT_API_PATH } from "../endpoints/chat.endpoint";
import type {
  AssignConversationPayload,
  ConversationResponseDto,
  CreateConversationPayload,
  MessageResponseDto,
  MuteConversationPreset,
  NicknameConversationPayload,
  PaginatedMessagesDto,
  PinConversationPayload,
  SendMessageAttachmentDto,
  SendMessagePayload,
  UpdateConversationStatusPayload,
} from "../dtos/chat.dto";
import {
  createMockMessage,
  filterMockConversations,
  getMockConversation,
  getMockConversations,
  getMockMessages,
  updateMockConversation,
  type ConversationFilter,
} from "./mocks/chat.mock";

export const USE_MOCK = true;

const tryRealOrMock = async <T>(
  real: () => Promise<T>,
  mock: () => T | Promise<T>,
): Promise<T> => {
  if (USE_MOCK) return mock();
  try {
    return await real();
  } catch (error) {
    console.warn("Falling back to mock:", error);
    return mock();
  }
};

export const getChatConversations = async (
  filter?: ConversationFilter,
): Promise<ConversationResponseDto[]> => {
  return tryRealOrMock<ConversationResponseDto[]>(
    async () => {
      const { data } = await axiosClient.get<ConversationResponseDto[]>(
        CHAT_API_PATH.CONVERSATIONS,
        { params: { filter } },
      );
      return data;
    },
    () => filterMockConversations(filter ?? "all"),
  );
};

export const getChatConversationDetail = async (
  id: number,
): Promise<ConversationResponseDto | null> => {
  return tryRealOrMock(
    async () => {
      const { data } = await axiosClient.get<ConversationResponseDto>(
        CHAT_API_PATH.CONVERSATION(id),
      );
      return data;
    },
    () => getMockConversation(id),
  );
};

export const getConversationMessages = async (
  conversationId: number,
  pagination?: { page?: number; limit?: number },
): Promise<MessageResponseDto[]> => {
  return tryRealOrMock(
    async () => {
      const { data } = await axiosClient.get<PaginatedMessagesDto>(
        CHAT_API_PATH.CONVERSATION_MESSAGES(conversationId),
        { params: pagination },
      );
      return data.data;
    },
    () => getMockMessages(conversationId),
  );
};

export const sendChatMessage = async (
  payload: SendMessagePayload,
): Promise<MessageResponseDto | null> => {
  return tryRealOrMock(
    async () => {
      const { data } = await axiosClient.post<MessageResponseDto>(
        "/chat/messages",
        payload,
      );
      return data;
    },
    () => {
      const message = createMockMessage({
        conversationId: payload.conversationId,
        senderId: 0,
        senderName: "Bạn",
        content: payload.content,
        type: "TEXT",
        attachments: payload.attachments ?? [],
      });
      updateMockConversation(payload.conversationId, {
        lastMessagePreview: payload.content ?? "(đính kèm)",
        lastMessageAt: message.createdAt,
      });
      return message;
    },
  );
};

export const createChatConversation = async (
  payload: CreateConversationPayload,
): Promise<ConversationResponseDto> => {
  return tryRealOrMock(
    async () => {
      const { data } = await axiosClient.post<ConversationResponseDto>(
        CHAT_API_PATH.CONVERSATIONS,
        payload,
      );
      return data;
    },
    () => {
      const newConv: ConversationResponseDto = {
        conversationId: Date.now(),
        conversationName: `Cuộc trò chuyện #${Date.now()}`,
        conversationAvatar: "NA",
        conversationCreatedAt: new Date().toISOString(),
        lastMessagePreview: payload.initialMessage ?? "",
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        type: payload.type,
        status: "OPEN",
        priority: payload.priority ?? "NORMAL",
        relatedBookingId: payload.relatedBookingId,
        toUser: {
          userId: payload.toUserId,
          fullName: "Liên hệ mới",
          username: "user",
          avatarUrl: "NA",
          email: "",
          role: "USER",
        },
        participants: [
          { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false },
        ],
      };
      return newConv;
    },
  );
};

export const muteConversation = async (payload: {
  conversationId: number;
  preset: MuteConversationPreset["preset"];
}): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(CHAT_API_PATH.CONVERSATION_MUTE(payload.conversationId), {
        preset: payload.preset,
      });
    },
    () => undefined,
  );
};

export const pinConversation = async (
  payload: PinConversationPayload,
): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(
        CHAT_API_PATH.CONVERSATION_PIN(payload.conversationId),
        { isPinned: payload.isPinned },
      );
    },
    () => {
      const conv = getMockConversation(payload.conversationId);
      if (conv) {
        conv.participants[0] = {
          ...conv.participants[0],
          isPinned: payload.isPinned,
        };
      }
    },
  );
};

export const setConversationNickname = async (
  payload: NicknameConversationPayload,
): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(
        CHAT_API_PATH.CONVERSATION_NICKNAME(payload.conversationId),
        { nickname: payload.nickname },
      );
    },
    () => {
      const conv = getMockConversation(payload.conversationId);
      if (conv) {
        conv.participants[0] = {
          ...conv.participants[0],
          nickname: payload.nickname ?? undefined,
        };
        if (payload.nickname) {
          conv.conversationName = payload.nickname;
        }
      }
    },
  );
};

export const assignConversation = async (
  payload: AssignConversationPayload,
): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(
        CHAT_API_PATH.CONVERSATION_ASSIGN(payload.conversationId),
        { assigneeId: payload.assigneeId },
      );
    },
    () => {
      updateMockConversation(payload.conversationId, {
        assignedTo: payload.assigneeId === null ? undefined : "Bạn",
      });
    },
  );
};

export const updateConversationStatus = async (
  payload: UpdateConversationStatusPayload,
): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(
        CHAT_API_PATH.CONVERSATION_STATUS(payload.conversationId),
        { status: payload.status, priority: payload.priority },
      );
    },
    () => {
      updateMockConversation(payload.conversationId, {
        status: payload.status,
        priority: payload.priority ?? undefined,
      });
    },
  );
};

export const markConversationAsRead = async (
  conversationId: number,
  _lastMessageId: number,
): Promise<void> => {
  return tryRealOrMock<void>(
    async () => {
      await axiosClient.post(
        `${CHAT_API_PATH.CONVERSATION(conversationId)}/read`,
        { lastMessageId: _lastMessageId },
      );
    },
    () => {
      updateMockConversation(conversationId, { unreadCount: 0 });
    },
  );
};

export const getOperatorHotlines = async (): Promise<
  ConversationResponseDto[]
> => {
  return tryRealOrMock<ConversationResponseDto[]>(
    async () => {
      const { data } = await axiosClient.get<ConversationResponseDto[]>(
        CHAT_API_PATH.OPERATORS,
      );
      return data;
    },
    () => [],
  );
};

export type { SendMessageAttachmentDto };
