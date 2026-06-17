import type {
  ConversationPriority,
  ConversationStatus,
} from "@/api/dtos/chat.dto";

export const statusLabel = (status: ConversationStatus) => {
  const map: Record<ConversationStatus, string> = {
    OPEN: "Đang mở",
    PENDING: "Chờ xử lý",
    RESOLVED: "Đã xử lý",
    CLOSED: "Đã đóng",
  };
  return map[status] ?? status;
};

export const priorityLabel = (priority: ConversationPriority) => {
  const map: Record<ConversationPriority, string> = {
    LOW: "Thấp",
    NORMAL: "Bình thường",
    HIGH: "Cao",
    URGENT: "Khẩn cấp",
  };
  return map[priority] ?? priority;
};
