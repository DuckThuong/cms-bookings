import pinIcn from "../../../assets/svg/profile/pin.svg";
import { MessageTypeEnum } from "../../../common/constants/constants";
import { formatLastMessageAt } from "../../../common/contexts/format";
import "../style.scss";

export interface ChatItemProps {
  icon?: string;
  name?: string;
  content?: string;
  time?: string;
  isRead?: boolean;
  focus?: boolean;
  type?: string;
  isPinned?: boolean;
}

export const ChatItem = (props: ChatItemProps) => {
  const isSystemConversation =
    props.type === MessageTypeEnum.RENT || props.type === MessageTypeEnum.CONTACT;

  const previewContent = isSystemConversation
    ? "Tư vấn đặt phòng"
    : props.content || "Không có tin nhắn nào";

  return (
    <div className={`chat__item ${props.focus && "focus"}`}>
      <div className="chat__item-left">
        <img src={props.icon} alt={props.name || "avatar"} />
      </div>
      <div className="chat__item-right">
        <p className={`line-1 ${props.isRead && "read"}`}>
          <span className="chat__item-name">
            {props.name || "Cuộc trò chuyện"}
          </span>
          <span className="chat__item-meta">
            {props.isPinned && (
              <span className="chat__item-pin">
                <img src={pinIcn} alt="pinned" />
              </span>
            )}
          </span>
        </p>
        <p className={`line-2 ${isSystemConversation ? "system" : ""}`}>
          <span className="chat__item-preview">{previewContent}</span>
          <span className="chat__item-time">
            {props.time ? formatLastMessageAt(props.time) : ""}
          </span>
        </p>
      </div>
    </div>
  );
};
