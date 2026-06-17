import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Button, Input, Tooltip, Upload } from "antd";
import {
  AudioOutlined,
  CloseOutlined,
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { uploadImage } from "@/api/configs/common.config";
import { sendChatMessage } from "@/api/configs/chat.config";
import type {
  MessageResponseDto,
  SendMessageAttachmentDto,
} from "@/api/dtos/chat.dto";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
} from "@/common/constants/constants";
import { useNotification } from "@/providers/notificationProvider";
import "../style.scss";

export interface ChatInputProps {
  conversationId: number;
  disabled?: boolean;
  placeholder?: string;
  onMessageSent?: (message: MessageResponseDto) => void;
  droppedFilesPayload?: {
    id: number;
    files: File[];
  } | null;
}

type DraftAttachment = {
  id: string;
  file: File;
  preview: string;
};

const resolveErrorMessage = (error: unknown): string => {
  let nextMessage = DEFAULT_MESSAGE;
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string") {
      nextMessage = apiMessage;
    } else if (Array.isArray(apiMessage) && apiMessage[0]) {
      nextMessage = String(apiMessage[0]);
    }
  } else if (error instanceof Error && error.message) {
    nextMessage = error.message;
  }
  return nextMessage;
};

export const ChatInput = (props: ChatInputProps) => {
  const { showNotification } = useNotification();
  const [files, setFiles] = useState<DraftAttachment[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const isBusy = props.disabled || isSending || isUploading;

  const addSelectedFiles = useCallback((selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    setFiles((prev) => [
      ...prev,
      ...selectedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  useEffect(() => {
    if (!props.droppedFilesPayload?.files?.length) return;
    addSelectedFiles(props.droppedFilesPayload.files);
  }, [addSelectedFiles, props.droppedFilesPayload]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const removeAttachment = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = cursorPositionRef.current;
    const newMessage =
      message.slice(0, start) + emojiData.emoji + message.slice(start);
    setMessage(newMessage);
    setTimeout(() => {
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const resetComposer = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const uploadAttachments = async (
    selected: DraftAttachment[],
  ): Promise<SendMessageAttachmentDto[]> => {
    return Promise.all(
      selected.map(async (item) => {
        const formData = new FormData();
        formData.append("file", item.file);
        try {
          const uploadResult = await uploadImage(formData);
          return {
            fileName: item.file.name,
            mimeType: item.file.type || "application/octet-stream",
            size: item.file.size,
            url: uploadResult.imageUrl,
          };
        } catch (error) {
          throw new Error(
            `Khong the tai file ${item.file.name}: ${resolveErrorMessage(error)}`,
          );
        }
      }),
    );
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    const hasFiles = files.length > 0;
    if ((!trimmedMessage && !hasFiles) || !props.conversationId || isBusy) {
      return;
    }

    setIsSending(true);
    setIsUploading(hasFiles);

    try {
      const attachments = hasFiles ? await uploadAttachments(files) : undefined;
      const createdMessage = await sendChatMessage({
        conversationId: props.conversationId,
        content: trimmedMessage || undefined,
        attachments,
      });

      if (createdMessage) {
        props.onMessageSent?.(createdMessage);
      }

      resetComposer();
    } catch (error) {
      showNotification(resolveErrorMessage(error), NOTI_ERROR);
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`chat__composer ${files.length > 0 ? "chat__composer--has-files" : ""}`}
    >
      {files.length > 0 ? (
        <div className="chat__composer-attachments">
          {files.map((attachment) => {
            const isImage = attachment.file.type.startsWith("image/");
            return (
              <div
                key={attachment.id}
                className="chat__composer-attachment"
              >
                {isImage ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="chat__composer-attachment-img"
                  />
                ) : (
                  <div className="chat__composer-attachment-file">
                    <PaperClipOutlined />
                    <span>{attachment.file.name}</span>
                  </div>
                )}
                <Button
                  type="text"
                  size="small"
                  className="chat__composer-attachment-remove"
                  icon={<CloseOutlined />}
                  onClick={() => removeAttachment(attachment.id)}
                  aria-label="Xóa file đính kèm"
                />
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="chat__composer-row">
        <div className="chat__composer-actions-left">
          <Upload
            showUploadList={false}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            multiple
            disabled={isBusy}
            beforeUpload={(file) => {
              addSelectedFiles([file as File]);
              return Upload.LIST_IGNORE;
            }}
          >
            <Tooltip title="Đính kèm file">
              <Button
                type="text"
                className="chat__composer-icon-btn"
                disabled={isBusy}
                icon={<PaperClipOutlined />}
                aria-label="Đính kèm file"
              />
            </Tooltip>
          </Upload>

          <Tooltip title="Emoji">
            <Button
              type="text"
              className={`chat__composer-icon-btn ${showEmojiPicker ? "chat__composer-icon-btn--active" : ""}`}
              disabled={isBusy}
              icon={<SmileOutlined />}
              onClick={() => setShowEmojiPicker((v) => !v)}
              aria-label="Mở bảng emoji"
            />
          </Tooltip>
        </div>

        <Input.TextArea
          ref={textareaRef}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder={props.placeholder ?? "Nhập tin nhắn..."}
          className="chat__composer-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isBusy}
          onSelect={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onClick={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await sendMessage();
            }
          }}
        />

        <div className="chat__composer-actions-right">
          <Tooltip title="Tin nhắn thoại (sắp ra mắt)">
            <Button
              type="text"
              className="chat__composer-icon-btn"
              disabled
              icon={<AudioOutlined />}
              aria-label="Ghi âm"
            />
          </Tooltip>
          <Tooltip title="Gửi">
            <Button
              type="primary"
              className="chat__composer-send"
              icon={<SendOutlined />}
              loading={isSending}
              disabled={isBusy || (!message.trim() && files.length === 0)}
              onClick={() => {
                void sendMessage();
              }}
              aria-label="Gửi tin nhắn"
            />
          </Tooltip>
        </div>
      </div>

      {showEmojiPicker ? (
        <div
          ref={emojiPickerRef}
          className="chat__composer-emoji-picker"
          role="dialog"
          aria-label="Bảng chọn emoji"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            width={320}
            height={380}
          />
        </div>
      ) : null}
    </div>
  );
};
