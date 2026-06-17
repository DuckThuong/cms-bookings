import { Avatar, Button, Tag, Tooltip } from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CopyOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import "../style.scss";
import type {
  ConversationPriority,
  ConversationResponseDto,
  ConversationStatus,
} from "@/api/dtos/chat.dto";
import {
  priorityLabel,
  statusLabel,
} from "@/common/constants/chat";
import { formatDateDDMMYYYY } from "@/common/contexts/format";

export interface ChatInfoPanelProps {
  conversation: ConversationResponseDto;
  onClose?: () => void;
  onCopy?: (text: string, label: string) => void;
}

const TYPE_LABEL: Record<ConversationResponseDto["type"], string> = {
  CUSTOMER: "Khách hàng",
  OPERATOR: "Đối tác nhà xe",
  ADMIN: "Quản trị viên",
  SUPPORT: "Hỗ trợ viên",
};

const TYPE_ICON: Record<ConversationResponseDto["type"], React.ReactNode> = {
  CUSTOMER: <UserOutlined />,
  OPERATOR: <ShopOutlined />,
  ADMIN: <CustomerServiceOutlined />,
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
  OPEN: "#3b82f6",
  PENDING: "#eab308",
  RESOLVED: "#22c55e",
  CLOSED: "#94a3b8",
};

const formatDate = formatDateDDMMYYYY;

export const ChatInfoPanel = ({
  conversation,
  onClose,
  onCopy,
}: ChatInfoPanelProps) => {
  const displayName =
    conversation.conversationName ||
    conversation.toUser?.fullName ||
    "Cuộc trò chuyện";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  const type = conversation.type;
  const color = TYPE_COLOR[type];
  const role = TYPE_LABEL[type];
  const priorityColor = PRIORITY_COLOR[conversation.priority];

  const handleCopy = (text: string, label: string) => {
    if (onCopy) {
      onCopy(text, label);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
  };

  return (
    <aside className="chat__info">
      <div className="chat__info-hero">
        {onClose ? (
          <Button
            type="text"
            shape="circle"
            className="chat__info-close"
            onClick={onClose}
            aria-label="Đóng thông tin"
          >
            ×
          </Button>
        ) : null}
        <Avatar
          size={88}
          className="chat__info-avatar"
          style={{ background: color }}
        >
          {initials}
        </Avatar>
        <h3 className="chat__info-name">{displayName}</h3>
        <div className="chat__info-role" style={{ background: `${color}1a`, color }}>
          {TYPE_ICON[type]}
          <span>{role}</span>
        </div>
        <div className="chat__info-tags">
          <Tag
            className="chat__info-tag"
            style={{
              background: `${STATUS_TAG_COLOR[conversation.status]}1a`,
              color: STATUS_TAG_COLOR[conversation.status],
              border: "none",
            }}
          >
            <CheckCircleFilled /> {statusLabel(conversation.status)}
          </Tag>
          <Tag
            className="chat__info-tag"
            style={{
              background: `${priorityColor}1a`,
              color: priorityColor,
              border: "none",
            }}
          >
            {conversation.priority === "URGENT" ? <WarningFilled /> : null}
            {priorityLabel(conversation.priority)}
          </Tag>
        </div>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Thông tin liên hệ</h4>
        <ul className="chat__info-list">
          {conversation?.toUser?.email ? (
            <li className="chat__info-item">
              <span className="chat__info-item-icon">
                <MailOutlined />
              </span>
              <div className="chat__info-item-body">
                <span className="chat__info-item-label">Email</span>
                <div className="chat__info-item-row">
                  <span className="chat__info-item-value">
                    {conversation.toUser.email}
                  </span>
                  <Tooltip title="Sao chép">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() =>
                        handleCopy(
                          conversation.toUser?.email ?? "",
                          "email",
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            </li>
          ) : null}
          {conversation.toUser?.phone ? (
            <li className="chat__info-item">
              <span className="chat__info-item-icon">
                <PhoneOutlined />
              </span>
              <div className="chat__info-item-body">
                <span className="chat__info-item-label">Số điện thoại</span>
                <div className="chat__info-item-row">
                  <span className="chat__info-item-value">
                    {conversation.toUser.phone}
                  </span>
                  <Tooltip title="Sao chép">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() =>
                        handleCopy(
                          conversation.toUser?.phone ?? "",
                          "phone",
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            </li>
          ) : null}
          <li className="chat__info-item">
            <span className="chat__info-item-icon">
              <CalendarOutlined />
            </span>
            <div className="chat__info-item-body">
              <span className="chat__info-item-label">Ngày tạo</span>
              <span className="chat__info-item-value">
                {formatDate(conversation.conversationCreatedAt)}
              </span>
            </div>
          </li>
          {conversation.relatedBookingId ? (
            <li className="chat__info-item">
              <span className="chat__info-item-icon">
                <EnvironmentOutlined />
              </span>
              <div className="chat__info-item-body">
                <span className="chat__info-item-label">Mã đặt vé</span>
                <span className="chat__info-item-value chat__info-item-value--mono">
                  {conversation.relatedBookingId}
                </span>
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Phân công & xử lý</h4>
        <ul className="chat__info-list">
          <li className="chat__info-item">
            <span className="chat__info-item-icon">
              <UserOutlined />
            </span>
            <div className="chat__info-item-body">
              <span className="chat__info-item-label">Người phụ trách</span>
              <span className="chat__info-item-value">
                {conversation.assignedTo ?? "Chưa phân công"}
              </span>
            </div>
          </li>
          <li className="chat__info-item">
            <span className="chat__info-item-icon">
              <WarningFilled />
            </span>
            <div className="chat__info-item-body">
              <span className="chat__info-item-label">Mức độ ưu tiên</span>
              <span
                className="chat__info-item-value"
                style={{ color: priorityColor, fontWeight: 600 }}
              >
                {priorityLabel(conversation.priority)}
              </span>
            </div>
          </li>
        </ul>
      </div>

      {conversation.tags && conversation.tags.length > 0 ? (
        <div className="chat__info-section">
          <h4 className="chat__info-section-title">Nhãn</h4>
          <div className="chat__info-tags-wrap">
            {conversation.tags.map((tag) => (
              <Tag key={tag} className="chat__info-tag-chip">
                #{tag}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Hành động nhanh</h4>
        <div className="chat__info-actions">
          <Button block icon={<CheckCircleFilled />}>
            Đánh dấu đã xử lý
          </Button>
          <Button block icon={<CloseCircleFilled />} danger>
            Đóng cuộc trò chuyện
          </Button>
        </div>
      </div>
    </aside>
  );
};
