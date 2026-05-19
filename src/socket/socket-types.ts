import type {
  ConversationResponseDto,
  MessageResponseDto,
  SendMessagePayloadDto,
} from "../api/dtos/chat.dto";

export interface SocketEventMeta {
  requestId?: string;
  conversationId?: number;
  sentAt: string;
  version: number;
}

export interface SocketEventEnvelope<T> {
  event: string;
  data: T;
  meta: SocketEventMeta;
}

export interface SocketAck<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  requestId?: string;
}

export interface JoinLeaveConversationPayload {
  conversationId: number;
}

export interface SendMessageSocketPayload extends SendMessagePayloadDto {
  requestId?: string;
}

export interface ReadMessageSocketPayload {
  conversationId: number;
  messageId?: number;
  requestId?: string;
}

export interface MessageStatusUpdatedPayload {
  conversationId: number;
  messageId: number;
  status: "SENT" | "DELIVERED" | "READ";
  updatedAt: string;
  actorUserId?: number;
}

export type MessageSentEvent = SocketEventEnvelope<MessageResponseDto>;
export type ConversationUpdatedEvent =
  SocketEventEnvelope<ConversationResponseDto>;
export type MessageStatusUpdatedEvent =
  SocketEventEnvelope<MessageStatusUpdatedPayload>;
