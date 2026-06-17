import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Input, type MenuProps } from "antd";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getConversationMessages,
  muteConversation,
  pinConversation,
  setConversationNickname,
} from "../../../api/configs/chat.config";
import type {
  ConversationResponseDto,
  MessageAttachmentResponseDto,
  MessageResponseDto,
  MuteConversationPreset,
} from "../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../api/endpoints/chat.endpoint";
import bellOffIcn from "../../../assets/svg/profile/bellOff.svg";
import bioIcn from "../../../assets/svg/profile/bio.svg";
import deleteIcn from "../../../assets/svg/profile/delete.svg";
import hideIcn from "../../../assets/svg/profile/hide.svg";
import penIcn from "../../../assets/svg/profile/pen.svg";
import pinIcn from "../../../assets/svg/profile/pin.svg";
import unpinIcn from "../../../assets/svg/profile/unpin.svg";
import threeDotIcn from "../../../assets/svg/three-dots.svg";
import { chatSocket } from "../../../socket/domains/chat.socket";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";

export interface ChatPanelProps {
  data?: ConversationResponseDto;
  currentUserId?: number;
}

interface Conversation {
  id: number;
  page: number;
  limit: number;
}

const mutePresetItems: {
  key: string;
  preset: MuteConversationPreset;
  label: string;
}[] = [
    { key: "mute-15m", preset: "15m", label: "15 phút" },
    { key: "mute-1h", preset: "1h", label: "1 giờ" },
    { key: "mute-8h", preset: "8h", label: "8 giờ" },
    { key: "mute-24h", preset: "24h", label: "24 giờ" },
    {
      key: "mute-no-end-time-yet",
      preset: "no end time yet",
      label: "Cho đến khi tôi bật lại",
    },
  ];

export const ChatPanel = (props: ChatPanelProps) => {
  const queryClient = useQueryClient();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messageBodyRef = useRef<HTMLElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const dragCounterRef = useRef(0);
  const [conversation, setConversation] = useState<Conversation>({
    id: props?.data?.conversationId || 0,
    page: 1,
    limit: 20,
  });
  const [isBodyDragActive, setIsBodyDragActive] = useState(false);
  const [droppedFilesPayload, setDroppedFilesPayload] = useState<{
    id: number;
    files: File[];
  } | null>(null);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [lightboxState, setLightboxState] = useState<{
    images: Array<{ url: string; fileName?: string }>;
    index: number;
  } | null>(null);

  const isDraggingNativeFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types || []).includes("Files");

  const resetBodyDragState = useCallback(() => {
    dragCounterRef.current = 0;
    setIsBodyDragActive(false);
  }, []);

  const currentLightboxImage = lightboxState
    ? lightboxState.images[lightboxState.index]
    : undefined;

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
  }, []);

  const openImageViewer = useCallback(
    (images: MessageAttachmentResponseDto[], startIndex: number) => {
      const normalizedImages = images
        .filter((item) => Boolean(item.url))
        .map((item) => ({
          url: item.url,
          fileName: item.fileName,
        }));

      if (!normalizedImages.length) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(startIndex, 0),
        normalizedImages.length - 1,
      );

      setLightboxState({
        images: normalizedImages,
        index: safeIndex,
      });
    },
    [],
  );

  const showPrevImage = useCallback(() => {
    setLightboxState((current) => {
      if (!current || current.images.length <= 1) {
        return current;
      }

      return {
        ...current,
        index:
          (current.index - 1 + current.images.length) % current.images.length,
      };
    });
  }, []);

  const showNextImage = useCallback(() => {
    setLightboxState((current) => {
      if (!current || current.images.length <= 1) {
        return current;
      }

      return {
        ...current,
        index: (current.index + 1) % current.images.length,
      };
    });
  }, []);

  const currentParticipant = useMemo(
    () =>
      props.currentUserId != null
        ? props.data?.participants.find(
          (participant) => participant.userId === props.currentUserId,
        )
        : undefined,
    [props.currentUserId, props.data?.participants],
  );

  const fallbackName =
    props.data?.conversationName ||
    props.data?.toUser?.fullName ||
    props.data?.toUser?.username ||
    "Cuộc trò chuyện";

  const displayName = currentParticipant?.nickname || fallbackName;
  const displayAvatar =
    props.data?.conversationAvatar || props.data?.toUser?.avatarUrl || "";
  const displayEmail = props.data?.toUser?.email || "";
  const isPinned = !!currentParticipant?.isPinned;

  useEffect(() => {
    if (props?.data?.conversationId) {
      setConversation((prev) => ({
        ...prev,
        id: props.data!.conversationId,
      }));
    }
  }, [props?.data?.conversationId]);

  useEffect(() => {
    setNicknameInput(displayName);
    setIsNicknameEditing(false);
  }, [displayName, props.data?.conversationId]);

  const invalidateConversationList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
    });
  };

  const setNicknameMutation = useMutation({
    mutationFn: (nickname: string | null) =>
      setConversationNickname({
        conversationId: props.data!.conversationId,
        nickname,
      }),
    onSuccess: invalidateConversationList,
  });

  const pinConversationMutation = useMutation({
    mutationFn: (nextPinned: boolean) =>
      pinConversation({
        conversationId: props.data!.conversationId,
        isPinned: nextPinned,
      }),
    onSuccess: invalidateConversationList,
  });

  const muteConversationMutation = useMutation({
    mutationFn: (preset: MuteConversationPreset) =>
      muteConversation({
        conversationId: props.data!.conversationId,
        preset,
      }),
    onSuccess: invalidateConversationList,
  });

  const { data: message } = useQuery<MessageResponseDto[]>({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
    queryFn: () =>
      getConversationMessages(conversation.id, {
        page: conversation.page,
        limit: conversation.limit,
      }),
    enabled: !!props.data?.conversationId,
  });

  const sortedMessages = useMemo(
    () =>
      [...(message ?? [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [message],
  );
  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const lastMessageId = latestMessage?.id;
  const lastOwnMessageId = useMemo(
    () =>
      [...sortedMessages]
        .reverse()
        .find((item) => item.senderId === props.currentUserId)?.id,
    [props.currentUserId, sortedMessages],
  );

  useEffect(() => {
    if (!props.data?.conversationId) return;

    chatSocket
      .joinConversation(props.data.conversationId)
      .catch(() => undefined);

    return () => {
      chatSocket
        .leaveConversation(props.data!.conversationId)
        .catch(() => undefined);
    };
  }, [props.data?.conversationId]);

  useEffect(() => {
    if (!props.data?.conversationId) {
      resetBodyDragState();
      return;
    }

    const handleWindowDragEnter = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      dragCounterRef.current += 1;
      setIsBodyDragActive(true);
    };

    const handleWindowDragOver = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
    };

    const handleWindowDragLeave = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      dragCounterRef.current -= 1;

      if (dragCounterRef.current <= 0) {
        resetBodyDragState();
      }
    };

    const handleWindowDrop = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) return;

      event.preventDefault();
      resetBodyDragState();
    };

    globalThis.addEventListener("dragenter", handleWindowDragEnter);
    globalThis.addEventListener("dragover", handleWindowDragOver);
    globalThis.addEventListener("dragleave", handleWindowDragLeave);
    globalThis.addEventListener("drop", handleWindowDrop);

    return () => {
      globalThis.removeEventListener("dragenter", handleWindowDragEnter);
      globalThis.removeEventListener("dragover", handleWindowDragOver);
      globalThis.removeEventListener("dragleave", handleWindowDragLeave);
      globalThis.removeEventListener("drop", handleWindowDrop);
    };
  }, [props.data?.conversationId]);

  useEffect(() => {
    const panelElement = panelRef.current;
    if (!panelElement || !props.data?.conversationId) return;

    const handleBodyDragOver = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const handleBodyDrop = (event: DragEvent) => {
      if (!isDraggingNativeFiles(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const droppedFiles = Array.from(event.dataTransfer?.files || []);
      if (!droppedFiles.length) {
        resetBodyDragState();
        return;
      }

      setDroppedFilesPayload({ id: Date.now(), files: droppedFiles });
      resetBodyDragState();
    };

    panelElement.addEventListener("dragover", handleBodyDragOver);
    panelElement.addEventListener("drop", handleBodyDrop);

    return () => {
      panelElement.removeEventListener("dragover", handleBodyDragOver);
      panelElement.removeEventListener("drop", handleBodyDrop);
    };
  }, [props.data?.conversationId, resetBodyDragState]);

  useEffect(() => {
    const unsubscribeMessage = chatSocket.subscribeMessageSent((event) => {
      if (event.data.conversationId !== props.data?.conversationId) return;

      queryClient.setQueryData<MessageResponseDto[]>(
        [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
        (currentMessages = []) => {
          if (currentMessages.some((item) => item.id === event.data.id)) {
            return currentMessages;
          }

          return [event.data, ...currentMessages];
        },
      );
    });

    const unsubscribeConversation = chatSocket.subscribeConversationUpdated(
      (event) => {
        queryClient.setQueryData<ConversationResponseDto[]>(
          [ConverationEndpoint.GET_CHAT_CONVERSATION],
          (currentConversations = []) =>
            currentConversations.map((item) =>
              item.conversationId === event.data.conversationId
                ? event.data
                : item,
            ),
        );
      },
    );

    const unsubscribeStatus = chatSocket.subscribeMessageStatusUpdated(
      (event) => {
        if (event.data.conversationId !== props.data?.conversationId) return;

        queryClient.setQueryData<MessageResponseDto[]>(
          [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
          (currentMessages = []) =>
            currentMessages.map((item) =>
              item.id === event.data.messageId
                ? {
                  ...item,
                  status: event.data.status,
                  updatedAt: event.data.updatedAt,
                }
                : item,
            ),
        );
      },
    );

    return () => {
      unsubscribeMessage();
      unsubscribeConversation();
      unsubscribeStatus();
    };
  }, [conversation, props.data?.conversationId, queryClient]);

  useEffect(() => {
    if (!messageBodyRef.current) return;

    messageBodyRef.current.scrollTo({
      top: messageBodyRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [props.data?.conversationId]);

  useEffect(() => {
    if (!lastMessageId) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessageId]);

  useEffect(() => {
    if (!props.data?.conversationId || !latestMessage) return;
    if (latestMessage.senderId === props.currentUserId) return;
    if (latestMessage.status === "READ") return;

    chatSocket
      .markConversationAsRead({
        conversationId: props.data.conversationId,
        messageId: latestMessage.id,
      })
      .catch(() => undefined);
  }, [latestMessage, props.currentUserId, props.data?.conversationId]);

  useEffect(() => {
    if (!lightboxState) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxState]);

  useEffect(() => {
    if (!lightboxState) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevImage();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxState, showNextImage, showPrevImage]);

  const commitNickname = async () => {
    const trimmedNickname = nicknameInput.trim();
    const currentNickname = currentParticipant?.nickname?.trim() || "";

    setIsNicknameEditing(false);

    if (trimmedNickname === currentNickname) {
      setNicknameInput(currentParticipant?.nickname || fallbackName);
      return;
    }

    await setNicknameMutation.mutateAsync(trimmedNickname || null);
  };

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "nickname") {
      setIsNicknameEditing(true);
      return;
    }

    if (key === "pin") {
      await pinConversationMutation.mutateAsync(!isPinned);
      return;
    }

    const mutePreset = mutePresetItems.find((item) => item.key === key)?.preset;
    if (mutePreset) {
      await muteConversationMutation.mutateAsync(mutePreset);
    }
  };

  const chatMenuAction: MenuProps["items"] = [
    {
      key: "nickname",
      label: "Đặt biệt danh",
      icon: <img src={penIcn} alt="pen" />,
    },
    {
      key: "profile",
      label: "Xem trang cá nhân",
      icon: <img src={bioIcn} alt="bio" />,
    },
    {
      key: "pin",
      label: isPinned ? "Bỏ ghim cuộc trò chuyện" : "Ghim cuộc trò chuyện",
      icon: (
        <img
          src={isPinned ? unpinIcn : pinIcn}
          alt={isPinned ? "unpin" : "pin"}
        />
      ),
    },
    {
      key: "mute",
      label: "Tắt thông báo",
      icon: <img src={bellOffIcn} alt="bell-off" />,
      children: mutePresetItems.map((item) => ({
        key: item.key,
        label: item.label,
      })),
    },
    {
      key: "hide",
      label: "Ẩn cuộc trò chuyện",
      icon: <img src={hideIcn} alt="hide" />,
    },
    {
      key: "delete",
      label: "Xóa cuộc trò chuyện",
      icon: <img src={deleteIcn} alt="delete" />,
    },
  ];

  return (
    <>
      {props.data && (
        <div
          ref={panelRef}
          className={`chat__panel ${isBodyDragActive ? "is-drag-active" : ""}`}
        >
          <div className="chat__panel-header">
            <div className="chat__panel-header-left">
              <img src={displayAvatar} alt={displayName} />
            </div>
            <div className="chat__panel-header-right">
              <div className="row-left">
                {!isNicknameEditing ? (
                  <p className="line-1 name-label show">{displayName}</p>
                ) : (
                  <Input
                    autoFocus
                    className="name-input show"
                    id="name-input"
                    name="name"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        await commitNickname();
                      }
                    }}
                    onBlur={commitNickname}
                  />
                )}
                <p className="line-2">{displayEmail}</p>
              </div>

              <div className="row-right">
                <Dropdown
                  menu={{
                    items: chatMenuAction,
                    onClick: handleMenuClick,
                  }}
                  trigger={["click"]}
                >
                  <img
                    src={threeDotIcn}
                    alt="three-dot"
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </div>
            </div>
          </div>
          {isBodyDragActive && (
            <div className="chat__panel-drop-overlay" aria-hidden="true">
              <div className="chat__panel-drop-hint">Thả file tại đây</div>
            </div>
          )}
          <section ref={messageBodyRef} className="chat__panel-body">
            {message && message.length > 0 ? (
              <>
                {sortedMessages.map((item) => (
                  <ChatLabel
                    key={item.id}
                    isYour={item.senderId === props.currentUserId}
                    timeLine={item.createdAt}
                    content={item.content || ""}
                    avartar={item.senderAvatarUrl || displayAvatar}
                    type={item.type}
                    attachments={item.attachments}
                    metadata={item.metadata}
                    onOpenImageViewer={openImageViewer}
                    messageStatus={
                      item.status === "SENT" ||
                        item.status === "DELIVERED" ||
                        item.status === "READ"
                        ? item.status
                        : undefined
                    }
                    showStatus={
                      item.senderId === props.currentUserId &&
                      item.id === lastOwnMessageId
                    }
                  />
                ))}
              </>
            ) : (
              <ChatLabel
                isYour={true}
                timeLine={props.data.conversationCreatedAt}
                content={
                  props.data.lastMessagePreview || "Không có tin nhắn nào"
                }
                avartar={displayAvatar}
              />
            )}
            <div ref={messageEndRef} />
          </section>
          <div className="chat__panel-footer">
            <ChatInput
              conversationId={props.data.conversationId}
              droppedFilesPayload={droppedFilesPayload}
            />
          </div>
          {lightboxState && currentLightboxImage && (
            <dialog
              className="chat__lightbox"
              open
              aria-label="Xem ảnh đính kèm"
            >
              <Button
                className="chat__lightbox-backdrop"
                onClick={closeLightbox}
                aria-label="Đóng ảnh xem trước"
                type="text"
              />
              <div className="chat__lightbox-content">
                <div className="chat__lightbox-topbar">
                  <p className="chat__lightbox-tip" aria-hidden="true">
                    Nhấn ESC để đóng
                  </p>
                  <Button
                    className="chat__lightbox-close"
                    onClick={closeLightbox}
                    aria-label="Đóng ảnh xem trước"
                    type="text"
                  >
                    ×
                  </Button>
                </div>

                <div className="chat__lightbox-stage">
                  {lightboxState.images.length > 1 && (
                    <Button
                      className="chat__lightbox-nav chat__lightbox-nav--prev"
                      onClick={showPrevImage}
                      aria-label="Ảnh trước"
                      type="text"
                    >
                      ‹
                    </Button>
                  )}

                  <img
                    className="chat__lightbox-image"
                    src={currentLightboxImage.url}
                    alt={
                      currentLightboxImage.fileName ||
                      `image-${lightboxState.index + 1}`
                    }
                  />

                  {lightboxState.images.length > 1 && (
                    <Button
                      className="chat__lightbox-nav chat__lightbox-nav--next"
                      onClick={showNextImage}
                      aria-label="Ảnh tiếp theo"
                      type="text"
                    >
                      ›
                    </Button>
                  )}
                </div>
                <div className="chat__lightbox-bottombar">
                  <div className="chat__lightbox-meta">
                    <span className="chat__lightbox-counter">
                      {lightboxState.index + 1}/{lightboxState.images.length}
                    </span>
                    <p className="chat__lightbox-caption">
                      {currentLightboxImage.fileName ||
                        `Ảnh ${lightboxState.index + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            </dialog>
          )}
        </div>
      )}
    </>
  );
};
