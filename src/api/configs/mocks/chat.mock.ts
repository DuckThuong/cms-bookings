import type {
  ConversationResponseDto,
  ConversationStatus,
  ConversationPriority,
  MessageResponseDto,
} from "../../dtos/chat.dto";

const HOUR = 1000 * 60 * 60;

const seedMessages: Record<number, MessageResponseDto[]> = {
  1: [
    {
      id: 5001,
      conversationId: 1,
      senderId: 201,
      senderName: "Nguyễn Văn An",
      senderAvatarUrl: "NA",
      content:
        "Chào admin, tôi đã thanh toán vé chuyến HN-ĐN lúc 14:30 ngày mai nhưng chưa nhận được mã vé. Đơn hàng #VX-2045.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 0.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.5 * HOUR).toISOString(),
    },
    {
      id: 5002,
      conversationId: 1,
      senderId: 0,
      senderName: "GoRide Support",
      senderAvatarUrl: "GR",
      content:
        "Chào anh An, em đã ghi nhận. Cho em xin 2 phút kiểm tra hệ thống nhé ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 0.45 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.45 * HOUR).toISOString(),
    },
    {
      id: 5003,
      conversationId: 1,
      senderId: 201,
      senderName: "Nguyễn Văn An",
      senderAvatarUrl: "NA",
      content: "Đây là ảnh chụp màn hình thanh toán của tôi.",
      type: "IMAGE",
      status: "READ",
      attachments: [
        {
          fileName: "payment-screenshot.png",
          mimeType: "image/png",
          size: 248000,
          url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
        },
      ],
      createdAt: new Date(Date.now() - 24 * 0.3 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.3 * HOUR).toISOString(),
    },
    {
      id: 5004,
      conversationId: 1,
      senderId: 0,
      senderName: "GoRide Support",
      senderAvatarUrl: "GR",
      content:
        "Cảm ơn anh. Em xác nhận giao dịch đã thành công. Mã vé PT-HN-DN-2031 đã được gửi qua email và SMS cho anh rồi ạ. Anh kiểm tra giúp em.",
      type: "TEXT",
      status: "DELIVERED",
      attachments: [],
      createdAt: new Date(Date.now() - 0.1 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 0.1 * HOUR).toISOString(),
    },
  ],
  2: [
    {
      id: 4001,
      conversationId: 2,
      senderId: 301,
      senderName: "Trần Thị Bích",
      senderAvatarUrl: "TB",
      content:
        "Tôi muốn hỏi về việc đổi lịch chuyến xe ngày 20/6. Hiện tại hệ thống báo lỗi khi tôi thao tác.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
    },
    {
      id: 4002,
      conversationId: 2,
      senderId: 0,
      senderName: "GoRide Support",
      senderAvatarUrl: "GR",
      content:
        "Chào chị Bích, em có thể gửi mã vé giúp em không ạ? Em sẽ hỗ trợ chị đổi vé ngay.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 1.2 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 1.2 * HOUR).toISOString(),
    },
  ],
  3: [
    {
      id: 3001,
      conversationId: 3,
      senderId: 401,
      senderName: "Lê Văn Cường",
      senderAvatarUrl: "LC",
      content: "Nhà xe Phương Trang cần hỗ trợ cập nhật lịch trình 3 chuyến.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 3 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 3 * HOUR).toISOString(),
    },
  ],
  4: [
    {
      id: 2001,
      conversationId: 4,
      senderId: 501,
      senderName: "Phạm Hồng Đức",
      senderAvatarUrl: "PD",
      content: "Tôi không nhận được email xác nhận đăng ký tài khoản.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    },
  ],
  5: [
    {
      id: 1001,
      conversationId: 5,
      senderId: 601,
      senderName: "Hoàng Mai E",
      senderAvatarUrl: "HE",
      content: "Cần hỗ trợ hoàn tiền gấp cho khách hàng đã hủy chuyến.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 0.2 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 0.2 * HOUR).toISOString(),
    },
  ],
};

const mockConversations: ConversationResponseDto[] = [
  {
    conversationId: 1,
    conversationName: "Nguyễn Văn An",
    conversationAvatar: "NA",
    conversationCreatedAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
    lastMessagePreview:
      "Cảm ơn anh. Em xác nhận giao dịch đã thành công. Mã vé PT-HN-DN-2031...",
    lastMessageAt: new Date(Date.now() - 0.1 * HOUR).toISOString(),
    unreadCount: 0,
    type: "CUSTOMER",
    status: "OPEN",
    priority: "HIGH",
    assignedTo: "Bạn",
    tags: ["payment", "vex"],
    relatedBookingId: "VX-2045",
    toUser: {
      userId: 201,
      fullName: "Nguyễn Văn An",
      username: "nguyenvanan",
      avatarUrl: "NA",
      email: "an.nv@gmail.com",
      phone: "0987 654 321",
      role: "USER",
    },
    participants: [
      {
        userId: 0,
        fullName: "Bạn",
        isPinned: true,
        isMuted: false,
        isAssigned: true,
      },
      { userId: 201, fullName: "Nguyễn Văn An", isPinned: false, isMuted: false },
    ],
  },
  {
    conversationId: 2,
    conversationName: "Trần Thị Bích",
    conversationAvatar: "TB",
    conversationCreatedAt: new Date(Date.now() - 24 * 5 * HOUR).toISOString(),
    lastMessagePreview:
      "Chào chị Bích, em có thể gửi mã vé giúp em không ạ?",
    lastMessageAt: new Date(Date.now() - 24 * 1.2 * HOUR).toISOString(),
    unreadCount: 2,
    type: "CUSTOMER",
    status: "PENDING",
    priority: "NORMAL",
    assignedTo: "Bạn",
    tags: ["change-ticket"],
    relatedBookingId: "VX-1842",
    toUser: {
      userId: 301,
      fullName: "Trần Thị Bích",
      username: "tranthibich",
      avatarUrl: "TB",
      email: "bich.tt@gmail.com",
      phone: "0912 345 678",
      role: "USER",
    },
    participants: [
      { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false, isAssigned: true },
      { userId: 301, fullName: "Trần Thị Bích", isPinned: false, isMuted: false },
    ],
  },
  {
    conversationId: 3,
    conversationName: "Phương Trang Futa",
    conversationAvatar: "PT",
    conversationCreatedAt: new Date(Date.now() - 24 * 14 * HOUR).toISOString(),
    lastMessagePreview: "Nhà xe Phương Trang cần hỗ trợ cập nhật lịch trình 3 chuyến.",
    lastMessageAt: new Date(Date.now() - 24 * 3 * HOUR).toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    status: "OPEN",
    priority: "NORMAL",
    assignedTo: "Lê Hùng",
    tags: ["operator", "schedule"],
    toUser: {
      userId: 401,
      fullName: "Lê Văn Cường",
      username: "cuonglv",
      avatarUrl: "LC",
      email: "cuong@phuongtrang.vn",
      phone: "1900 6067",
      role: "OPERATOR",
    },
    participants: [
      { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false, isAssigned: false },
      { userId: 401, fullName: "Lê Văn Cường", isPinned: false, isMuted: false },
    ],
  },
  {
    conversationId: 4,
    conversationName: "Phạm Hồng Đức",
    conversationAvatar: "PD",
    conversationCreatedAt: new Date(Date.now() - 24 * 6 * HOUR).toISOString(),
    lastMessagePreview: "Tôi không nhận được email xác nhận đăng ký tài khoản.",
    lastMessageAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    unreadCount: 1,
    type: "CUSTOMER",
    status: "OPEN",
    priority: "URGENT",
    assignedTo: null,
    tags: ["auth", "email"],
    toUser: {
      userId: 501,
      fullName: "Phạm Hồng Đức",
      username: "ducph",
      avatarUrl: "PD",
      email: "duc.pham@gmail.com",
      phone: "0938 765 432",
      role: "USER",
    },
    participants: [
      { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false, isAssigned: false },
      { userId: 501, fullName: "Phạm Hồng Đức", isPinned: false, isMuted: false },
    ],
  },
  {
    conversationId: 5,
    conversationName: "Hoàng Mai E",
    conversationAvatar: "HE",
    conversationCreatedAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
    lastMessagePreview: "Cần hỗ trợ hoàn tiền gấp cho khách hàng đã hủy chuyến.",
    lastMessageAt: new Date(Date.now() - 0.2 * HOUR).toISOString(),
    unreadCount: 1,
    type: "SUPPORT",
    status: "OPEN",
    priority: "URGENT",
    assignedTo: null,
    tags: ["refund", "escalate"],
    toUser: {
      userId: 601,
      fullName: "Hoàng Mai E",
      username: "hoangmaie",
      avatarUrl: "HE",
      email: "hoangmaie@goride.vn",
      phone: "0901 234 567",
      role: "SUPPORT",
    },
    participants: [
      { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false, isAssigned: false },
      { userId: 601, fullName: "Hoàng Mai E", isPinned: false, isMuted: false },
    ],
  },
  {
    conversationId: 6,
    conversationName: "Thiên Long",
    conversationAvatar: "TL",
    conversationCreatedAt: new Date(Date.now() - 24 * 30 * HOUR).toISOString(),
    lastMessagePreview: "Đã chuyển khoản thành công, vui lòng xác nhận.",
    lastMessageAt: new Date(Date.now() - 24 * 5 * HOUR).toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    status: "RESOLVED",
    priority: "LOW",
    assignedTo: "Bạn",
    tags: ["payment"],
    toUser: {
      userId: 701,
      fullName: "Nguyễn Thị Lan",
      username: "lannt",
      avatarUrl: "NL",
      email: "lan@thienlong.vn",
      phone: "1900 1520",
      role: "OPERATOR",
    },
    participants: [
      { userId: 0, fullName: "Bạn", isPinned: false, isMuted: false, isAssigned: true },
      { userId: 701, fullName: "Nguyễn Thị Lan", isPinned: false, isMuted: false },
    ],
  },
];

let nextMessageId = 100000;

export const getMockConversations = (): ConversationResponseDto[] => {
  return [...mockConversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt ?? 0).getTime() -
      new Date(a.lastMessageAt ?? 0).getTime(),
  );
};

export const getMockConversation = (id: number): ConversationResponseDto | null =>
  mockConversations.find((c) => c.conversationId === id) ?? null;

export const getMockMessages = (conversationId: number): MessageResponseDto[] =>
  seedMessages[conversationId] ?? [];

export const createMockMessage = (
  payload: Omit<MessageResponseDto, "id" | "createdAt" | "updatedAt" | "status">,
): MessageResponseDto => {
  nextMessageId += 1;
  const now = new Date().toISOString();
  return {
    ...payload,
    id: nextMessageId,
    status: "SENT",
    createdAt: now,
    updatedAt: now,
  };
};

export const updateMockConversation = (
  id: number,
  updates: Partial<ConversationResponseDto>,
) => {
  const idx = mockConversations.findIndex((c) => c.conversationId === id);
  if (idx >= 0) {
    mockConversations[idx] = { ...mockConversations[idx], ...updates };
  }
};

export type ConversationFilter = "all" | "unread" | "assigned" | "resolved";

export const filterMockConversations = (filter: ConversationFilter) => {
  const items = getMockConversations();
  if (filter === "unread") {
    return items.filter((c) => c.unreadCount > 0);
  }
  if (filter === "assigned") {
    return items.filter((c) => c.assignedTo === "Bạn");
  }
  if (filter === "resolved") {
    return items.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED");
  }
  return items;
};

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
