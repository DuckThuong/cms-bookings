import { Avatar, Badge, Tag, Tooltip } from "antd";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  PushpinFilled,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { formatLastMessageAt } from "@/common/contexts/format";
import {
  priorityLabel,
  statusLabel,
} from "@/api/configs/mocks/chat.mock";
import type {
  ConversationPriority,
  ConversationResponseDto,
  ConversationStatus,
} from "@/api/dtos/chat.dto";
import "../style.scss";

export interface ChatListItemProps {
  conversation: ConversationResponseDto;
  isActive?: boolean;
  onClick?: () => void;
}

const TYPE_LABEL: Record<ConversationResponseDto["type"], string> = {
  CUSTOMER: "Khách hàng",
  OPERATOR: "Nhà xe",
  ADMIN: "Quản trị",
  SUPPORT: "Hỗ trợ",
};

const TYPE_ICON: Record<ConversationResponseDto["type"], React.ReactNode> = {
  CUSTOMER: <UserOutlined />,
  OPERATOR: <ShopOutlined />,
  ADMIN: <CheckCircleFilled />,
  SUPPORT: <TeamOutlined />,
};

const TYPE_COLOR: Record<ConversationResponseDto["type"], string> = {
  CUSTOMER: "#3b82f6",
  OPERATOR: "#a855f7",
  ADMIN: "#22c55e",
  SUPPORT: "#f97316",
};

const PRIORITY_COLOR: Record<ConversationPriority, string> = {
  LOW: "#94a3b8",
  NORMAL: "#3b82f6",
  HIGH: "#f97316",
  URGENT: "#ef4444",
};

const STATUS_TAG_COLOR: Record<ConversationStatus, string> = {
  OPEN: "#f97316",
  PENDING: "#3b82f6",
  RESOLVED: "#1d4ed8",
  CLOSED: "#94a3b8",
};

const getDisplayName = (conversation: ConversationResponseDto) =>
  conversation.conversationName ||
  conversation.toUser?.fullName ||
  "Cuộc trò chuyện";

const getInitials = (conversation: ConversationResponseDto) => {
  const name = getDisplayName(conversation);
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const getPreview = (conversation: ConversationResponseDto) => {
  if (conversation.lastMessagePreview) {
    return conversation.lastMessagePreview;
  }
  return "Chưa có tin nhắn nào trong cuộc trò chuyện này.";
};

export const ChatListItem = ({
  conversation,
  isActive,
  onClick,
}: ChatListItemProps) => {
  const displayName = getDisplayName(conversation);
  const initials = getInitials(conversation);
  const preview = getPreview(conversation);
  const unread = conversation.unreadCount ?? 0;
  const isPinned = conversation.participants[0]?.isPinned;
  const isAssigned = !!conversation.assignedTo;

  return (
    <button
      type="button"
      className={`chat__list-item ${isActive ? "chat__list-item--active" : ""}`}
      onClick={onClick}
    >
      {isPinned ? (
        <span className="chat__list-pin-flag" aria-label="Đã ghim">
          <PushpinFilled />
        </span>
      ) : null}

      <div className="chat__list-avatar">
        <Avatar
          size={48}
          className="chat__list-avatar-img"
          style={{ background: TYPE_COLOR[conversation.type] }}
        >
          {initials}
        </Avatar>
        <span
          className="chat__list-type"
          style={{ background: TYPE_COLOR[conversation.type] }}
        >
          {TYPE_ICON[conversation.type]}
        </span>
        {unread > 0 ? (
          <Badge
            count={unread}
            size="small"
            className="chat__list-badge"
            overflowCount={99}
          />
        ) : null}
      </div>

      <div className="chat__list-body">
        <div className="chat__list-line-1">
          <span
            className={`chat__list-name ${unread > 0 ? "chat__list-name--unread" : ""}`}
          >
            {displayName}
          </span>
          <span className="chat__list-time">
            {conversation.lastMessageAt
              ? formatLastMessageAt(conversation.lastMessageAt)
              : ""}
          </span>
        </div>

        <div className="chat__list-line-2">
          <span
            className={`chat__list-preview ${unread > 0 ? "chat__list-preview--unread" : ""}`}
          >
            {preview}
          </span>
        </div>

        <div className="chat__list-meta">
          <span
            className="chat__list-type-label"
            style={{ color: TYPE_COLOR[conversation.type] }}
          >
            {TYPE_LABEL[conversation.type]}
          </span>
          <span
            className="chat__list-priority"
            style={{ background: `${PRIORITY_COLOR[conversation.priority]}1a`, color: PRIORITY_COLOR[conversation.priority] }}
          >
            {conversation.priority === "URGENT" ? (
              <WarningFilled />
            ) : null}
            {priorityLabel(conversation.priority)}
          </span>
          <Tag
            style={{
              color: STATUS_TAG_COLOR[conversation.status],
              backgroundColor: `${STATUS_TAG_COLOR[conversation.status]}22`,
              borderColor: `${STATUS_TAG_COLOR[conversation.status]}55`,
              margin: 0,
            }}
            className="chat__list-status-tag"
          >
            {statusLabel(conversation.status)}
          </Tag>
          {isAssigned ? (
            <Tooltip title={`Phân công: ${conversation.assignedTo}`}>
              <span className="chat__list-assigned">
                <CheckCircleFilled /> {conversation.assignedTo}
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="Chưa phân công">
              <span className="chat__list-unassigned">
                <ClockCircleOutlined /> Chờ
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </button>
  );
};
