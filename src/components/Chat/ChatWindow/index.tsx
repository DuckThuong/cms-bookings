import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Select,
  Tooltip,
  type MenuProps,
} from "antd";
import {
  BellOutlined,
  CheckCircleFilled,
  CopyOutlined,
  EllipsisOutlined,
  PushpinFilled,
  PushpinOutlined,
  SearchOutlined,
  SoundOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";
import { ChatQuickReplies, type QuickReply } from "../ChatQuickReplies";
import {
  assignConversation,
  getConversationMessages,
  muteConversation,
  pinConversation,
  setConversationNickname,
  updateConversationStatus,
} from "@/api/configs/chat.config";
import { CHAT_QUERY_KEYS } from "@/api/endpoints/chat.endpoint";
import type {
  ConversationPriority,
  ConversationResponseDto,
  ConversationStatus,
  MessageAttachmentResponseDto,
  MessageResponseDto,
  MuteConversationPreset,
} from "@/api/dtos/chat.dto";
import {
  priorityLabel,
  statusLabel,
} from "@/common/constants/chat";
import { chatSocket } from "@/socket/domains/chat.socket";
import "../style.scss";

export interface ChatWindowProps {
  data: ConversationResponseDto;
  currentUserId?: number;
  quickReplies?: QuickReply[];
  onQuickReplySelect?: (reply: QuickReply) => void;
}

const QUICK_REPLY_PRESETS: QuickReply[] = [
  {
    id: "qr-1",
    label: "Chào anh/chị, em là hỗ trợ viên GoRide",
    payload: "Chào anh/chị, em là hỗ trợ viên GoRide. Em có thể giúp gì cho mình ạ?",
  },
  {
    id: "qr-2",
    label: "Để em kiểm tra ngay",
    payload: "Để em kiểm tra thông tin ngay nhé ạ, anh/chị chờ em một chút.",
  },
  {
    id: "qr-3",
    label: "Đã xử lý xong",
    payload: "Vấn đề của anh/chị đã được xử lý xong ạ. Cảm ơn anh/chị đã liên hệ!",
  },
  {
    id: "qr-4",
    label: "Cảm ơn anh/chị",
    payload: "Cảm ơn anh/chị đã liên hệ. Chúc anh/chị một ngày tốt lành ạ!",
  },
];

const MUTE_OPTIONS: { key: string; label: string; preset: MuteConversationPreset["preset"] }[] = [
  { key: "15m", label: "15 phút", preset: "15m" },
  { key: "1h", label: "1 giờ", preset: "1h" },
  { key: "8h", label: "8 giờ", preset: "8h" },
  { key: "24h", label: "24 giờ", preset: "24h" },
  { key: "until", label: "Cho đến khi tôi bật lại", preset: "no end time yet" },
];

const STATUS_OPTIONS: { value: ConversationStatus; label: string; color: string }[] = [
  { value: "OPEN", label: "Đang mở", color: "#f97316" },
  { value: "PENDING", label: "Chờ xử lý", color: "#3b82f6" },
  { value: "RESOLVED", label: "Đã xử lý", color: "#1d4ed8" },
  { value: "CLOSED", label: "Đã đóng", color: "#94a3b8" },
];

const PRIORITY_OPTIONS: { value: ConversationPriority; label: string; color: string }[] = [
  { value: "LOW", label: "Thấp", color: "#94a3b8" },
  { value: "NORMAL", label: "Bình thường", color: "#3b82f6" },
  { value: "HIGH", label: "Cao", color: "#f97316" },
  { value: "URGENT", label: "Khẩn cấp", color: "#ef4444" },
];

export const ChatWindow = ({
  data,
  currentUserId,
  quickReplies,
  onQuickReplySelect,
}: ChatWindowProps) => {
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{
    images: MessageAttachmentResponseDto[];
    index: number;
  } | null>(null);

  const fallbackName =
    data.conversationName ||
    data.toUser?.fullName ||
    data.toUser?.username ||
    "Cuộc trò chuyện";
  const displayName = fallbackName;
  const displayAvatar = data.conversationAvatar || data.toUser?.avatarUrl || "";
  const displayEmail = data.toUser?.email || "";
  const displayPhone = data.toUser?.phone || "";
  const isPinned = !!data.participants[0]?.isPinned;
  const isMuted = !!data.participants[0]?.isMuted;

  const messagesQuery = useQuery<MessageResponseDto[]>({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
    queryFn: () =>
      getConversationMessages(data.conversationId, { page: 1, limit: 50 }),
    enabled: !!data.conversationId,
  });

  const sortedMessages = useMemo(
    () =>
      [...(messagesQuery.data ?? [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messagesQuery.data],
  );

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return sortedMessages;
    const q = search.toLowerCase();
    return sortedMessages.filter((m) =>
      (m.content ?? "").toLowerCase().includes(q),
    );
  }, [sortedMessages, search]);

  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const lastOwnMessageId = useMemo(
    () =>
      [...sortedMessages]
        .reverse()
        .find((item) => item.senderId === currentUserId)?.id,
    [currentUserId, sortedMessages],
  );

  useEffect(() => {
    if (!data.conversationId) return;
    chatSocket.joinConversation(data.conversationId).catch(() => {
      // socket chưa sẵn sàng - bỏ qua im lặng
    });
    return () => {
      chatSocket.leaveConversation(data.conversationId).catch(() => undefined);
    };
  }, [data.conversationId]);

  useEffect(() => {
    const unsubscribeMessage = chatSocket.subscribeMessageSent((event) => {
      if (event.data.conversationId !== data.conversationId) return;
      queryClient.setQueryData<MessageResponseDto[]>(
        [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
        (current = []) => {
          if (current.some((item) => item.id === event.data.id)) {
            return current;
          }
          return [...current, event.data];
        },
      );
    });

    const unsubscribeStatus = chatSocket.subscribeMessageStatusUpdated(
      (event) => {
        if (event.data.conversationId !== data.conversationId) return;
        queryClient.setQueryData<MessageResponseDto[]>(
          [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
          (current = []) =>
            current.map((item) =>
              item.id === event.data.messageId
                ? { ...item, status: event.data.status }
                : item,
            ),
        );
      },
    );

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [data.conversationId, queryClient]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [sortedMessages.length]);

  useEffect(() => {
    if (!latestMessage) return;
    if (latestMessage.senderId === currentUserId) return;
    if (latestMessage.status === "READ") return;
    chatSocket
      .markConversationAsRead({
        conversationId: data.conversationId,
        messageId: latestMessage.id,
      })
      .catch(() => undefined);
  }, [latestMessage, currentUserId, data.conversationId]);

  const pinMutation = useMutation({
    mutationFn: (nextPinned: boolean) =>
      pinConversation({
        conversationId: data.conversationId,
        isPinned: nextPinned,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const muteMutation = useMutation({
    mutationFn: (preset: MuteConversationPreset["preset"]) =>
      muteConversation({
        conversationId: data.conversationId,
        preset,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const nicknameMutation = useMutation({
    mutationFn: (nickname: string | null) =>
      setConversationNickname({
        conversationId: data.conversationId,
        nickname,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (assigneeId: number | null) =>
      assignConversation({
        conversationId: data.conversationId,
        assigneeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (next: ConversationStatus) =>
      updateConversationStatus({
        conversationId: data.conversationId,
        status: next,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const priorityMutation = useMutation({
    mutationFn: (next: ConversationPriority) =>
      updateConversationStatus({
        conversationId: data.conversationId,
        status: data.status,
        priority: next,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.CONVERSATIONS });
    },
  });

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "nickname") {
      const next = window.prompt(
        "Đặt tên hiển thị cho cuộc trò chuyện",
        displayName,
      );
      if (next !== null) {
        await nicknameMutation.mutateAsync(next.trim() || null);
      }
      return;
    }
    if (key === "pin") {
      await pinMutation.mutateAsync(!isPinned);
      return;
    }
    if (key === "unassign") {
      await assignMutation.mutateAsync(null);
      return;
    }
    if (key === "assign-me") {
      await assignMutation.mutateAsync(0);
      return;
    }
    if (key === "resolve") {
      await statusMutation.mutateAsync("RESOLVED");
      return;
    }
    if (key === "close") {
      await statusMutation.mutateAsync("CLOSED");
      return;
    }
    const muteOption = MUTE_OPTIONS.find((item) => item.key === key);
    if (muteOption) {
      await muteMutation.mutateAsync(muteOption.preset);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "nickname",
      label: "Đặt tên hiển thị",
      icon: <CopyOutlined />,
    },
    {
      key: "pin",
      label: isPinned ? "Bỏ ghim" : "Ghim cuộc trò chuyện",
      icon: isPinned ? <PushpinFilled /> : <PushpinOutlined />,
    },
    {
      key: "assign-me",
      label: "Nhận hỗ trợ",
      icon: <UserAddOutlined />,
      disabled: data.assignedTo === "Bạn",
    },
    {
      key: "unassign",
      label: "Hủy phân công",
      disabled: !data.assignedTo,
    },
    { type: "divider" },
    {
      key: "resolve",
      label: "Đánh dấu đã xử lý",
      disabled: data.status === "RESOLVED",
    },
    {
      key: "close",
      label: "Đóng cuộc trò chuyện",
      disabled: data.status === "CLOSED",
    },
    { type: "divider" },
    {
      key: "mute",
      label: "Tắt thông báo",
      icon: <BellOutlined />,
      children: MUTE_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
      })),
    },
  ];

  const openImageViewer = (
    images: MessageAttachmentResponseDto[],
    startIndex: number,
  ) => {
    setLightbox({ images, index: startIndex });
  };

  const closeLightbox = () => setLightbox(null);
  const showPrev = () =>
    setLightbox((current) =>
      current && current.images.length > 1
        ? {
            ...current,
            index:
              (current.index - 1 + current.images.length) %
              current.images.length,
          }
        : current,
    );
  const showNext = () =>
    setLightbox((current) =>
      current && current.images.length > 1
        ? {
            ...current,
            index: (current.index + 1) % current.images.length,
          }
        : current,
    );

  const replies = quickReplies ?? QUICK_REPLY_PRESETS;
  const statusMeta = STATUS_OPTIONS.find((s) => s.value === data.status);
  const priorityMeta = PRIORITY_OPTIONS.find((p) => p.value === data.priority);

  return (
    <div className="chat__window">
      <header className="chat__window-header">
        <div className="chat__window-header-main">
          <Avatar
            size={44}
            className="chat__window-avatar"
            src={displayAvatar || undefined}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="chat__window-info">
            <div className="chat__window-name-row">
              <h3 className="chat__window-name">{displayName}</h3>
              {data.toUser?.role ? (
                <Tooltip title={`Vai trò: ${data.toUser.role}`}>
                  <span className="chat__window-role">
                    {data.toUser.role}
                  </span>
                </Tooltip>
              ) : null}
              {data.relatedBookingId ? (
                <Tooltip title="Mã đặt vé liên quan">
                  <span className="chat__window-related">
                    {data.relatedBookingId}
                  </span>
                </Tooltip>
              ) : null}
            </div>
            <div className="chat__window-sub">
              <span
                className="chat__window-status-dot"
                style={{
                  background:
                    data.status === "OPEN"
                      ? "#f97316"
                      : data.status === "PENDING"
                        ? "#3b82f6"
                        : data.status === "RESOLVED"
                          ? "#1d4ed8"
                          : "#94a3b8",
                }}
              />
              <span className="chat__window-status-text">
                {data.assignedTo
                  ? `Phân công: ${data.assignedTo}`
                  : "Chưa phân công"}
              </span>
              <span className="chat__window-divider" />
              <span className="chat__window-email">{displayEmail || displayPhone}</span>
            </div>
          </div>
        </div>

        <div className="chat__window-header-actions">
          <Tooltip title="Tìm trong cuộc trò chuyện">
            <Button
              type="text"
              shape="circle"
              className="chat__window-icon-btn"
              icon={<SearchOutlined />}
              onClick={() => setSearchOpen((v) => !v)}
            />
          </Tooltip>
          <Tooltip title={isMuted ? "Bật thông báo" : "Tắt thông báo"}>
            <Button
              type="text"
              shape="circle"
              className="chat__window-icon-btn"
              icon={
                isMuted ? (
                  <SoundOutlined style={{ opacity: 0.4 }} />
                ) : (
                  <BellOutlined />
                )
              }
            />
          </Tooltip>
          <Tooltip title={isPinned ? "Bỏ ghim" : "Ghim"}>
            <Button
              type="text"
              shape="circle"
              className={`chat__window-icon-btn ${isPinned ? "chat__window-icon-btn--active" : ""}`}
              icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
              onClick={() => pinMutation.mutate(!isPinned)}
            />
          </Tooltip>
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              shape="circle"
              className="chat__window-icon-btn"
              icon={<EllipsisOutlined />}
            />
          </Dropdown>
        </div>
      </header>

      <div className="chat__window-meta">
        <div className="chat__window-status-pickers">
          <Select
            size="small"
            value={data.status}
            className="chat__window-picker chat__window-picker--status"
            popupMatchSelectWidth={false}
            onChange={(next) => statusMutation.mutate(next)}
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value,
              label: (
                <span className="chat__window-picker-option">
                  <span
                    className="chat__window-picker-dot"
                    style={{ background: opt.color }}
                  />
                  <span style={{ color: opt.color, fontWeight: 600 }}>
                    {opt.label}
                  </span>
                </span>
              ),
            }))}
            suffixIcon={null}
          />
          <Select
            size="small"
            value={data.priority}
            className="chat__window-picker chat__window-picker--priority"
            popupMatchSelectWidth={false}
            onChange={(next) => priorityMutation.mutate(next)}
            options={PRIORITY_OPTIONS.map((opt) => ({
              value: opt.value,
              label: (
                <span className="chat__window-picker-option">
                  <span
                    className="chat__window-picker-dot"
                    style={{ background: opt.color }}
                  />
                  <span style={{ color: opt.color, fontWeight: 600 }}>
                    {opt.label}
                  </span>
                </span>
              ),
            }))}
            suffixIcon={null}
          />
        </div>
        {searchOpen ? (
          <Input
            autoFocus
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm trong cuộc trò chuyện"
            className="chat__window-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => {
              if (!search) setSearchOpen(false);
            }}
          />
        ) : null}
      </div>

      <div className="chat__window-toolbar">
        <span
          className="chat__window-toolbar-chip chat__window-toolbar-chip--status"
          style={
            {
              color: statusMeta?.color,
              background: `${statusMeta?.color}1A`,
              borderColor: `${statusMeta?.color}55`,
            } as React.CSSProperties
          }
        >
          <CheckCircleFilled />
          {statusLabel(data.status)}
        </span>
        <span
          className="chat__window-toolbar-chip chat__window-toolbar-chip--priority"
          style={
            {
              color: priorityMeta?.color,
              background: `${priorityMeta?.color}1A`,
              borderColor: `${priorityMeta?.color}55`,
            } as React.CSSProperties
          }
        >
          {priorityLabel(data.priority)}
        </span>
        {data.tags && data.tags.length > 0 ? (
          <span className="chat__window-toolbar-tags">
            {data.tags.slice(0, 3).map((tag) => (
              <span className="chat__window-toolbar-tag" key={tag}>
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 ? (
              <Tooltip title={data.tags.slice(3).map((t) => `#${t}`).join("  ")}>
                <span className="chat__window-toolbar-tag chat__window-toolbar-tag--more">
                  +{data.tags.length - 3}
                </span>
              </Tooltip>
            ) : null}
          </span>
        ) : null}
        {data.assignedTo ? (
          <span className="chat__window-toolbar-chip chat__window-toolbar-chip--assignee">
            <UserAddOutlined /> {data.assignedTo}
          </span>
        ) : (
          <Button
            type="text"
            size="small"
            className="chat__window-toolbar-assign"
            onClick={() => assignMutation.mutate(0)}
          >
            <UserAddOutlined /> Nhận hỗ trợ
          </Button>
        )}
      </div>

      <section
        ref={bodyRef}
        className="chat__window-body"
        aria-label="Danh sách tin nhắn"
      >
        {filteredMessages.length === 0 ? (
          <div className="chat__window-empty">
            <div className="chat__window-empty-illu" aria-hidden>
              💬
            </div>
            <h4>Chưa có tin nhắn</h4>
            <p>
              {search.trim()
                ? `Không tìm thấy tin nhắn phù hợp với "${search.trim()}".`
                : "Gửi tin nhắn đầu tiên để bắt đầu hỗ trợ khách hàng."}
            </p>
          </div>
        ) : (
          <div className="chat__window-stream">
            {filteredMessages.map((message) => (
              <ChatLabel
                key={message.id}
                isYour={message.senderId === currentUserId}
                senderName={message.senderName}
                senderRole={
                  message.senderId === 0
                    ? "Hỗ trợ viên"
                    : data.toUser?.role
                }
                timeLine={message.createdAt}
                content={message.content || ""}
                avartar={message.senderAvatarUrl || displayAvatar}
                type={message.type}
                attachments={message.attachments}
                onOpenImageViewer={openImageViewer}
                messageStatus={
                  message.status === "SENT" ||
                  message.status === "DELIVERED" ||
                  message.status === "READ"
                    ? message.status
                    : undefined
                }
                showStatus={
                  message.senderId === currentUserId &&
                  message.id === lastOwnMessageId
                }
              />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </section>

      <div className="chat__window-quick-row">
        <ChatQuickReplies
          replies={replies}
          onSelect={onQuickReplySelect}
          title="Phản hồi nhanh"
        />
      </div>

      <div className="chat__window-footer">
        <ChatInput
          conversationId={data.conversationId}
          placeholder={`Phản hồi cho ${displayName}...`}
        />
      </div>

      {lightbox ? (
        <div
          className="chat__window-lightbox"
          role="dialog"
          aria-label="Xem ảnh đính kèm"
        >
          <button
            type="button"
            className="chat__window-lightbox-backdrop"
            onClick={closeLightbox}
            aria-label="Đóng"
          />
          <div className="chat__window-lightbox-content">
            <header className="chat__window-lightbox-top">
              <span className="chat__window-lightbox-counter">
                {lightbox.index + 1}/{lightbox.images.length}
              </span>
              <span className="chat__window-lightbox-name">
                {lightbox.images[lightbox.index]?.fileName ?? "Ảnh đính kèm"}
              </span>
              <Button
                type="text"
                shape="circle"
                onClick={closeLightbox}
                className="chat__window-lightbox-close"
                aria-label="Đóng ảnh"
              >
                ×
              </Button>
            </header>
            <div className="chat__window-lightbox-stage">
              {lightbox.images.length > 1 ? (
                <Button
                  type="text"
                  shape="circle"
                  className="chat__window-lightbox-nav chat__window-lightbox-nav--prev"
                  onClick={showPrev}
                  aria-label="Ảnh trước"
                >
                  ‹
                </Button>
              ) : null}
              <img
                src={lightbox.images[lightbox.index]?.url}
                alt={lightbox.images[lightbox.index]?.fileName ?? "image"}
                className="chat__window-lightbox-image"
              />
              {lightbox.images.length > 1 ? (
                <Button
                  type="text"
                  shape="circle"
                  className="chat__window-lightbox-nav chat__window-lightbox-nav--next"
                  onClick={showNext}
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
