import "../style.scss";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import tick from "../../../assets/svg/tick.svg";
import doubleTick from "../../../assets/svg/doubleTick.svg";
import type { MessageAttachmentResponseDto } from "../../../api/dtos/chat.dto";
import { formatLastMessageAt } from "../../../common/contexts/format";
import { MessageType } from "../../../common/constants/constants";

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
}

export const ChatLabel = (props: ChatLabelProps) => {
  const attachments = props.attachments || [];
  const imageAttachments = attachments.filter((item) =>
    item.mimeType?.startsWith("image/"),
  );
  const fileAttachments = attachments.filter(
    (item) => !item.mimeType?.startsWith("image/"),
  );

  let statusLabel = "";

  if (props.messageStatus === "READ") {
    statusLabel = "Đã đọc";
  } else if (props.messageStatus === "DELIVERED") {
    statusLabel = "Đã nhận";
  } else if (props.messageStatus === "SENT") {
    statusLabel = "Đã gửi";
  }

  const handleOpenImage = (index: number) => {
    if (!imageAttachments[index]?.url) {
      return;
    }

    if (props.onOpenImageViewer) {
      props.onOpenImageViewer(imageAttachments, index);
      return;
    }

    globalThis.open(
      imageAttachments[index].url,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className={`chat__label ${props.isYour && "yours"}`}>
      <div className="chat__label-avatar">
        <img src={props.avartar} alt={props.avartar} />
      </div>
      <div className="chat__label-content">
        <div className="row-1">
          {props.type === MessageType.SYSTEM ? (
            <p
              className="chat__label-content-text"
              dangerouslySetInnerHTML={{ __html: props.content || "" }}
            />
          ) : (
            <>
              {props.content && (
                <p className="chat__label-content-text">{props.content}</p>
              )}

              {attachments.length > 0 && (
                <div className="chat__label-attachments">
                  {imageAttachments.length > 0 && (
                    <div className="chat__label-attachments-images">
                      {imageAttachments.map((item, index) => (
                        <Button
                          key={`${item.url}-${index}`}
                          className="chat__label-attachments-image-item"
                          onClick={() => handleOpenImage(index)}
                          aria-label={`Xem ảnh ${item.fileName || index + 1}`}
                          type="text"
                        >
                          <img
                            src={item.url}
                            alt={item.fileName || `image-${index + 1}`}
                          />
                        </Button>
                      ))}
                    </div>
                  )}

                  {fileAttachments.length > 0 && (
                    <div className="chat__label-attachments-files">
                      {fileAttachments.map((item, index) => (
                        <div
                          key={`${item.url}-${index}`}
                          className="chat__label-file-item"
                        >
                          <span className="chat__label-file-name">
                            {item.fileName || "Tệp đính kèm"}
                          </span>
                          <div className="chat__label-file-actions">
                            {item.url ? (
                              <>
                                <Typography.Link
                                  className="chat__label-file-link"
                                  title="Mở file"
                                  aria-label={`Mở ${item.fileName || "tệp đính kèm"}`}
                                  href={item.url}
                                  target="_blank"
                                >
                                  <EyeOutlined aria-hidden="true" />
                                </Typography.Link>
                                <Typography.Link
                                  className="chat__label-file-link"
                                  title="Tải file"
                                  aria-label={`Tải ${item.fileName || "tệp đính kèm"}`}
                                  href={item.url}
                                  target="_blank"
                                >
                                  <DownloadOutlined aria-hidden="true" />
                                </Typography.Link>
                              </>
                            ) : (
                              <span
                                className="chat__label-file-link disabled"
                                aria-label="Tệp không khả dụng"
                              >
                                <EyeOutlined aria-hidden="true" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="row-2">
          <p className="chat__label-timeLine">
            {formatLastMessageAt(props.timeLine)}
            {props.showStatus && props.messageStatus && (
              <>
                <span>
                  {props.messageStatus === "SENT" ? (
                    <img src={tick} alt={"sent"} />
                  ) : (
                    <img
                      src={doubleTick}
                      alt={props.messageStatus.toLowerCase()}
                    />
                  )}
                </span>
                <span>{statusLabel}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
