import { Avatar, Tooltip, Typography } from "antd";
import {
  CheckOutlined,
  ClockCircleOutlined,
  DoubleRightOutlined,
  DownloadOutlined,
  EyeOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import "../style.scss";
import type { MessageAttachmentResponseDto } from "@/api/dtos/chat.dto";
import { formatDateTime, formatLastMessageAt } from "@/common/contexts/format";
import { MessageType } from "@/api/dtos/chat.dto";

export interface ChatLabelProps {
  isYour: boolean;
  timeLine: string;
  content: string;
  avartar: string;
  type?: string;
  attachments?: MessageAttachmentResponseDto[];
  onOpenImageViewer?: (
    images: MessageAttachmentResponseDto[],
    startIndex: number,
  ) => void;
  messageStatus?: "SENT" | "DELIVERED" | "READ";
  showStatus?: boolean;
  senderName?: string;
  senderRole?: string;
}

const STATUS_LABEL: Record<"SENT" | "DELIVERED" | "READ", string> = {
  SENT: "Đã gửi",
  DELIVERED: "Đã nhận",
  READ: "Đã đọc",
};

export const ChatLabel = (props: ChatLabelProps) => {
  const attachments = props.attachments || [];
  const imageAttachments = attachments.filter((item) =>
    item.mimeType?.startsWith("image/"),
  );
  const fileAttachments = attachments.filter(
    (item) => !item.mimeType?.startsWith("image/"),
  );

  const isSystem = props.type === MessageType.SYSTEM;

  const handleOpenImage = (index: number) => {
    if (!imageAttachments[index]?.url) {
      return;
    }
    if (props.onOpenImageViewer) {
      props.onOpenImageViewer(imageAttachments, index);
    }
  };

  return (
    <div
      className={`chat__bubble-row ${props.isYour ? "chat__bubble-row--own" : ""}`}
    >
      {!props.isYour ? (
        <Avatar
          size={32}
          className="chat__bubble-avatar"
          src={props.avartar || undefined}
        >
          {(props.senderName ?? "?").charAt(0).toUpperCase()}
        </Avatar>
      ) : null}

      <div
        className={`chat__bubble ${props.isYour ? "chat__bubble--own" : "chat__bubble--in"}`}
      >
        {!props.isYour && props.senderName ? (
          <div className="chat__bubble-sender-row">
            <span className="chat__bubble-sender">{props.senderName}</span>
            {props.senderRole ? (
              <span className="chat__bubble-sender-role">
                {props.senderRole}
              </span>
            ) : null}
            <span className="chat__bubble-sender-time">
              {formatDateTime(props.timeLine)}
            </span>
          </div>
        ) : null}

        {isSystem ? (
          <p
            className="chat__bubble-text"
            dangerouslySetInnerHTML={{ __html: props.content || "" }}
          />
        ) : (
          <>
            {props.content ? (
              <p className="chat__bubble-text">{props.content}</p>
            ) : null}

            {imageAttachments.length > 0 ? (
              <div
                className={`chat__bubble-images chat__bubble-images--${Math.min(imageAttachments.length, 4)}`}
              >
                {imageAttachments.slice(0, 4).map((item, index) => (
                  <button
                    type="button"
                    key={`${item.url}-${index}`}
                    className="chat__bubble-image"
                    onClick={() => handleOpenImage(index)}
                    aria-label={`Xem ảnh ${item.fileName || index + 1}`}
                  >
                    <img
                      src={item.url}
                      alt={item.fileName || `image-${index + 1}`}
                    />
                    {index === 3 && imageAttachments.length > 4 ? (
                      <span className="chat__bubble-image-more">
                        +{imageAttachments.length - 4}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            {fileAttachments.length > 0 ? (
              <div className="chat__bubble-files">
                {fileAttachments.map((item, index) => (
                  <div
                    key={`${item.url}-${index}`}
                    className="chat__bubble-file"
                  >
                    <PaperClipOutlined className="chat__bubble-file-icon" />
                    <span className="chat__bubble-file-name">
                      {item.fileName || "Tệp đính kèm"}
                    </span>
                    <span className="chat__bubble-file-actions">
                      {item.url ? (
                        <>
                          <Tooltip title="Mở file">
                            <Typography.Link
                              className="chat__bubble-file-link"
                              href={item.url}
                              target="_blank"
                              aria-label={`Mở ${item.fileName || "tệp đính kèm"}`}
                            >
                              <EyeOutlined />
                            </Typography.Link>
                          </Tooltip>
                          <Tooltip title="Tải xuống">
                            <Typography.Link
                              className="chat__bubble-file-link"
                              href={item.url}
                              target="_blank"
                              aria-label={`Tải ${item.fileName || "tệp đính kèm"}`}
                            >
                              <DownloadOutlined />
                            </Typography.Link>
                          </Tooltip>
                        </>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        <div className="chat__bubble-meta">
          <span className="chat__bubble-time">
            {formatLastMessageAt(props.timeLine)}
          </span>
          {props.showStatus && props.messageStatus && props.isYour ? (
            <Tooltip title={STATUS_LABEL[props.messageStatus]}>
              <span
                className={`chat__bubble-status chat__bubble-status--${props.messageStatus.toLowerCase()}`}
                aria-label={STATUS_LABEL[props.messageStatus]}
              >
                {props.messageStatus === "READ" ||
                props.messageStatus === "DELIVERED" ? (
                  <DoubleRightOutlined />
                ) : (
                  <CheckOutlined />
                )}
                <span className="chat__bubble-status-label">
                  {STATUS_LABEL[props.messageStatus]}
                </span>
              </span>
            </Tooltip>
          ) : null}
          {!props.isYour && !props.showStatus ? (
            <ClockCircleOutlined className="chat__bubble-clock" />
          ) : null}
        </div>
      </div>
    </div>
  );
};
