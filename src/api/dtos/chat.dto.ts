export type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
export type MessageStatus = "SENT" | "DELIVERED" | "READ";
export type MessageTypeEnum = MessageType;

export const MessageType = {
  TEXT: "TEXT" as MessageType,
  IMAGE: "IMAGE" as MessageType,
  FILE: "FILE" as MessageType,
  SYSTEM: "SYSTEM" as MessageType,
};

export const MessageTypeEnum = MessageType;

export type ConversationType = "OPERATOR" | "ADMIN" | "SUPPORT" | "CUSTOMER";
export type ConversationStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type ConversationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ConversationRole = "ADMIN" | "OPERATOR" | "SUPPORT" | "USER";

export interface ConversationToUser {
  userId: number;
  fullName: string;
  username: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  role: ConversationRole;
}

export interface ConversationParticipant {
  userId: number;
  fullName?: string;
  nickname?: string;
  isPinned: boolean;
  isMuted: boolean;
  mutedUntil?: string;
  isAssigned?: boolean;
}

export interface ConversationResponseDto {
  conversationId: number;
  conversationName?: string;
  conversationAvatar?: string;
  conversationCreatedAt: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  type: ConversationType;
  toUser?: ConversationToUser;
  participants: ConversationParticipant[];
  status: ConversationStatus;
  priority: ConversationPriority;
  assignedTo?: string;
  tags?: string[];
  relatedBookingId?: string;
}

export interface MessageAttachmentResponseDto {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
}

export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderName?: string;
  senderAvatarUrl?: string;
  content?: string;
  type: MessageType;
  status: MessageStatus;
  attachments: MessageAttachmentResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageAttachmentDto {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface SendMessagePayload {
  conversationId: number;
  content?: string;
  attachments?: SendMessageAttachmentDto[];
}

export interface CreateConversationPayload {
  toUserId: number;
  type: ConversationType;
  initialMessage?: string;
  priority?: ConversationPriority;
  relatedBookingId?: string;
}

export interface MuteConversationPreset {
  preset:
    | "15m"
    | "1h"
    | "8h"
    | "24h"
    | "no end time yet";
}

export interface PinConversationPayload {
  conversationId: number;
  isPinned: boolean;
}

export interface NicknameConversationPayload {
  conversationId: number;
  nickname: string | null;
}

export interface AssignConversationPayload {
  conversationId: number;
  assigneeId: number | null;
}

export interface UpdateConversationStatusPayload {
  conversationId: number;
  status: ConversationStatus;
  priority?: ConversationPriority;
}

export interface PaginatedMessagesDto {
  data: MessageResponseDto[];
  total: number;
  page: number;
  limit: number;
}
