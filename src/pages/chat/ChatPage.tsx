import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Empty,
  Input,
  Spin,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  createChatConversation,
  getChatConversations,
} from "@/api/configs/chat.config";
import { CHAT_QUERY_KEYS } from "@/api/endpoints/chat.endpoint";
import type { ConversationResponseDto } from "@/api/dtos/chat.dto";
import {
  ChatInfoPanel,
  ChatListItem,
  ChatWindow,
} from "@/components/Chat";
import "./style.scss";

type FilterKey =
  | "all"
  | "unread"
  | "assigned"
  | "pending"
  | "urgent"
  | "resolved";

const FILTER_LABELS: Record<FilterKey, { label: string; icon: React.ReactNode }> = {
  all: { label: "Tất cả", icon: <InboxOutlined /> },
  unread: { label: "Chưa đọc", icon: <Badge status="processing" /> },
  assigned: { label: "Của tôi", icon: <UserAddOutlined /> },
  pending: { label: "Chờ xử lý", icon: <ClockCircleOutlined /> },
  urgent: { label: "Khẩn cấp", icon: <Badge status="error" /> },
  resolved: { label: "Đã xử lý", icon: <CheckCircleOutlined /> },
};

const QUICK_REPLY_BY_TYPE: Record<ConversationResponseDto["type"], string[]> = {
  CUSTOMER: [
    "Chào anh/chị, em là hỗ trợ viên GoRide. Em có thể giúp gì cho mình ạ?",
    "Để em kiểm tra thông tin ngay nhé ạ",
    "Vấn đề đã được xử lý, anh/chị kiểm tra giúp em",
    "Cảm ơn anh/chị đã liên hệ",
  ],
  OPERATOR: [
    "Chào nhà xe, em hỗ trợ gì cho mình ạ?",
    "Đã ghi nhận yêu cầu từ nhà xe",
    "Hệ thống đã cập nhật lịch trình mới",
    "Cảm ơn nhà xe đã phản hồi",
  ],
  ADMIN: [
    "Chào admin, cần hỗ trợ gì ạ?",
    "Đã chuyển yêu cầu cho team phụ trách",
    "Báo cáo sự cố đã được xử lý",
  ],
  SUPPORT: [
    "Chào team, em cập nhật tiến độ nhé",
    "Hoàn tiền đã được ghi nhận",
    "Cảm ơn team đã hỗ trợ",
  ],
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);

  const conversationsQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATIONS],
    queryFn: () => getChatConversations("all"),
  });

  const startConversationMutation = useMutation({
    mutationFn: createChatConversation,
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
      setSelectedId(conversation.conversationId);
    },
  });

  const conversations = conversationsQuery.data ?? [];

  const filteredConversations = useMemo(() => {
    let items = conversations;
    if (filter === "unread") {
      items = items.filter((c) => c.unreadCount > 0);
    } else if (filter === "assigned") {
      items = items.filter((c) => c.assignedTo === "Bạn");
    } else if (filter === "pending") {
      items = items.filter((c) => c.status === "PENDING");
    } else if (filter === "urgent") {
      items = items.filter((c) => c.priority === "URGENT" || c.priority === "HIGH");
    } else if (filter === "resolved") {
      items = items.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED");
    }
    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (item) =>
          (item.conversationName ?? "").toLowerCase().includes(keyword) ||
          (item.toUser?.email ?? "").toLowerCase().includes(keyword) ||
          (item.lastMessagePreview ?? "").toLowerCase().includes(keyword) ||
          (item.toUser?.fullName ?? "").toLowerCase().includes(keyword),
      );
    }
    return items;
  }, [conversations, filter, search]);

  // Auto-select first conversation
  const activeConversation = useMemo(() => {
    if (filteredConversations.length === 0) return null;
    const found = filteredConversations.find(
      (c) => c.conversationId === selectedId,
    );
    return found ?? filteredConversations[0];
  }, [filteredConversations, selectedId]);

  const stats = useMemo(() => {
    const total = conversations.length;
    const unread = conversations.reduce((s, i) => s + (i.unreadCount ?? 0), 0);
    const assigned = conversations.filter((c) => c.assignedTo === "Bạn").length;
    const urgent = conversations.filter(
      (c) => c.priority === "URGENT" || c.priority === "HIGH",
    ).length;
    return { total, unread, assigned, urgent };
  }, [conversations]);

  // Sync selectedId
  useEffect(() => {
    if (activeConversation && selectedId !== activeConversation.conversationId) {
      setSelectedId(activeConversation.conversationId);
    }
  }, [activeConversation, selectedId]);

  const isLoading = conversationsQuery.isLoading;
  const isEmpty = !isLoading && filteredConversations.length === 0;

  const quickReplies = activeConversation
    ? QUICK_REPLY_BY_TYPE[activeConversation.type].map((label, index) => ({
        id: `${activeConversation.type}-${index}`,
        label: label.slice(0, 40) + (label.length > 40 ? "…" : ""),
        payload: label,
      }))
    : [];

  const handleQuickReply = (reply: { payload?: string }) => {
    if (!activeConversation || !reply.payload) return;
    // Use chat composer via socket or pass via window event
    // For now, the reply payload is sent directly via API
    void import("@/api/configs/chat.config").then(({ sendChatMessage }) => {
      sendChatMessage({
        conversationId: activeConversation.conversationId,
        content: reply.payload,
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, activeConversation.conversationId],
        });
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
      });
    });
  };

  return (
    <div className="chat-page">
      <header className="chat-page__hero">
        <div className="chat-page__hero-main">
          <span className="chat-page__hero-eyebrow">Hỗ trợ khách hàng</span>
          <h1 className="chat-page__hero-title">Hội thoại hỗ trợ</h1>
          <p className="chat-page__hero-desc">
            Quản lý yêu cầu từ khách hàng và đối tác nhà xe — phân công, ưu tiên và xử lý theo thời gian thực.
          </p>
        </div>
        <div className="chat-page__hero-stats">
          <div className="chat-page__hero-stat">
            <span className="chat-page__hero-stat-value">{stats.total}</span>
            <span className="chat-page__hero-stat-label">Tổng hội thoại</span>
          </div>
          <div className="chat-page__hero-stat chat-page__hero-stat--accent">
            <span className="chat-page__hero-stat-value">{stats.unread}</span>
            <span className="chat-page__hero-stat-label">Chưa đọc</span>
          </div>
          <div className="chat-page__hero-stat">
            <span className="chat-page__hero-stat-value">{stats.assigned}</span>
            <span className="chat-page__hero-stat-label">Của tôi</span>
          </div>
          <div className="chat-page__hero-stat chat-page__hero-stat--urgent">
            <span className="chat-page__hero-stat-value">{stats.urgent}</span>
            <span className="chat-page__hero-stat-label">Ưu tiên cao</span>
          </div>
        </div>
      </header>

      <div
        className={`chat-window-layout ${
          activeConversation && infoOpen ? "" : "chat-window-layout--no-info"
        }`}
      >
        <aside className="chat-window-layout__list">
          <div className="chat-page__list-toolbar">
            <Input
              allowClear
              size="large"
              value={search}
              prefix={<SearchOutlined />}
              placeholder="Tìm tên, email, mã vé..."
              onChange={(e) => setSearch(e.target.value)}
              className="chat-page__list-search"
            />
            <div className="chat-page__list-filters">
              <FilterOutlined className="chat-page__list-filter-icon" />
              {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => {
                const meta = FILTER_LABELS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`chat-page__list-filter ${
                      filter === key ? "chat-page__list-filter--active" : ""
                    }`}
                    onClick={() => setFilter(key)}
                  >
                    {meta.icon}
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="chat-page__list-meta">
            <span>{filteredConversations.length} hội thoại</span>
            {stats.unread > 0 ? (
              <Badge
                count={stats.unread}
                size="small"
                style={{ backgroundColor: "#f97316" }}
              />
            ) : null}
          </div>

          <div className="chat-page__list-scroll">
            {isLoading ? (
              <div className="chat-page__list-loading">
                <Spin />
              </div>
            ) : isEmpty ? (
              <Empty
                description="Chưa có hội thoại nào."
                className="chat-page__list-empty"
              />
            ) : (
              filteredConversations.map((conversation) => (
                <ChatListItem
                  key={conversation.conversationId}
                  conversation={conversation}
                  isActive={
                    activeConversation?.conversationId ===
                    conversation.conversationId
                  }
                  onClick={() => setSelectedId(conversation.conversationId)}
                />
              ))
            )}
          </div>

          <div className="chat-page__list-hotlines">
            <h4 className="chat-page__list-hotlines-title">
              Bắt đầu hội thoại
            </h4>
            <button
              type="button"
              className="chat-page__list-hotline"
              disabled={startConversationMutation.isPending}
              onClick={() =>
                startConversationMutation.mutate({
                  toUserId: 201,
                  type: "CUSTOMER",
                })
              }
            >
              <Avatar
                size={32}
                style={{ background: "#3b82f6" }}
                icon={<CustomerServiceOutlined />}
              />
              <div className="chat-page__list-hotline-info">
                <span className="chat-page__list-hotline-name">
                  Hỗ trợ khách hàng
                </span>
                <span className="chat-page__list-hotline-role">
                  Khách hàng mới
                </span>
              </div>
              <Tooltip title="Tạo hội thoại">
                <UserAddOutlined className="chat-page__list-hotline-icon" />
              </Tooltip>
            </button>
            <button
              type="button"
              className="chat-page__list-hotline chat-page__list-hotline--op"
              disabled={startConversationMutation.isPending}
              onClick={() =>
                startConversationMutation.mutate({
                  toUserId: 401,
                  type: "OPERATOR",
                })
              }
            >
              <Avatar
                size={32}
                style={{ background: "#a855f7" }}
                icon={<ShopOutlined />}
              />
              <div className="chat-page__list-hotline-info">
                <span className="chat-page__list-hotline-name">
                  Liên hệ nhà xe
                </span>
                <span className="chat-page__list-hotline-role">
                  Đối tác vận hành
                </span>
              </div>
              <Tooltip title="Tạo hội thoại">
                <UserAddOutlined className="chat-page__list-hotline-icon" />
              </Tooltip>
            </button>
            <button
              type="button"
              className="chat-page__list-hotline chat-page__list-hotline--admin"
              disabled={startConversationMutation.isPending}
              onClick={() =>
                startConversationMutation.mutate({
                  toUserId: 999,
                  type: "ADMIN",
                })
              }
            >
              <Avatar
                size={32}
                style={{ background: "#22c55e" }}
                icon={<CheckCircleOutlined />}
              />
              <div className="chat-page__list-hotline-info">
                <span className="chat-page__list-hotline-name">
                  Quản trị viên
                </span>
                <span className="chat-page__list-hotline-role">
                  Hỗ trợ nội bộ
                </span>
              </div>
              <Tooltip title="Tạo hội thoại">
                <UserAddOutlined className="chat-page__list-hotline-icon" />
              </Tooltip>
            </button>
          </div>
        </aside>

        <div className="chat-window-layout__main">
          {activeConversation ? (
            <div className="chat-window-layout__main-wrap">
              {!infoOpen ? (
                <Button
                  type="text"
                  shape="circle"
                  className="chat-window-layout__info-toggle"
                  icon={<InfoCircleOutlined />}
                  onClick={() => setInfoOpen(true)}
                  title="Mở thông tin hành khách"
                />
              ) : null}
              <ChatWindow
                data={activeConversation}
                currentUserId={0}
                quickReplies={quickReplies}
                onQuickReplySelect={handleQuickReply}
              />
            </div>
          ) : (
            <div className="chat-page__placeholder">
              <div className="chat-page__placeholder-illu" aria-hidden>
                🎧
              </div>
              <h3>Chọn một hội thoại</h3>
              <p>
                Hoặc bắt đầu hỗ trợ mới với khách hàng, đối tác nhà xe hoặc
                admin từ danh sách bên trái.
              </p>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() =>
                  startConversationMutation.mutate({
                    toUserId: 201,
                    type: "CUSTOMER",
                  })
                }
              >
                Tạo hội thoại mới
              </Button>
            </div>
          )}
        </div>

        {activeConversation && infoOpen ? (
          <div className="chat-window-layout__info">
            <ChatInfoPanel
              conversation={activeConversation}
              onClose={() => setInfoOpen(false)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
