import "../style.scss";
import { ThunderboltOutlined } from "@ant-design/icons";

export interface QuickReply {
  id: string;
  label: string;
  payload?: string;
}

export interface ChatQuickRepliesProps {
  replies: QuickReply[];
  onSelect?: (reply: QuickReply) => void;
  title?: string;
}

export const ChatQuickReplies = ({
  replies,
  onSelect,
  title = "Phản hồi nhanh",
}: ChatQuickRepliesProps) => {
  if (!replies.length) return null;
  return (
    <div className="chat__quick-replies">
      <div className="chat__quick-replies-head">
        <ThunderboltOutlined />
        <span>{title}</span>
      </div>
      <div className="chat__quick-replies-list">
        {replies.map((reply) => (
          <button
            key={reply.id}
            type="button"
            className="chat__quick-reply"
            onClick={() => onSelect?.(reply)}
          >
            {reply.label}
          </button>
        ))}
      </div>
    </div>
  );
};
