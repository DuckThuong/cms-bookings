import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin } from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { CHAT_QUERY_KEYS } from "@/api/endpoints/chat.endpoint";
import { getChatConversationDetail } from "@/api/configs/chat.config";
import { ChatInfoPanel, ChatWindow } from "@/components/Chat";
import { ROUTER_PATH } from "@/routers/Route";
import "./style.scss";

export const ChatDetailPage = () => {
  const params = useParams<{ id: string }>();
  const conversationId = Number(params.id);
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(true);

  const conversationQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATION_DETAIL, conversationId],
    queryFn: () => getChatConversationDetail(conversationId),
    enabled: Number.isFinite(conversationId),
  });

  if (!Number.isFinite(conversationId)) {
    return (
      <div className="chat-detail chat-detail--empty">
        <h3>ID hội thoại không hợp lệ</h3>
        <Button onClick={() => navigate(ROUTER_PATH.CHAT)}>Quay lại</Button>
      </div>
    );
  }

  if (conversationQuery.isLoading) {
    return (
      <div className="chat-detail chat-detail--loading">
        <Spin />
      </div>
    );
  }

  if (!conversationQuery.data) {
    return (
      <div className="chat-detail chat-detail--empty">
        <h3>Không tìm thấy hội thoại</h3>
        <p>
          Hội thoại có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
        <Button onClick={() => navigate(ROUTER_PATH.CHAT)}>Quay lại</Button>
      </div>
    );
  }

  const conversation = conversationQuery.data;

  return (
    <div className="chat-detail">
      <div className="chat-window-layout chat-detail__layout">
        <div className="chat-window-layout__main">
          <div className="chat-detail__window-wrap">
            <div className="chat-detail__topbar">
              <Button
                type="text"
                shape="circle"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(ROUTER_PATH.CHAT)}
                aria-label="Quay lại"
              />
              <div className="chat-detail__topbar-info">
                <h2>{conversation.conversationName}</h2>
                <span>
                  {conversation.type === "CUSTOMER"
                    ? "Khách hàng"
                    : conversation.type === "OPERATOR"
                      ? "Nhà xe"
                      : conversation.type === "ADMIN"
                        ? "Quản trị"
                        : "Hỗ trợ"}
                </span>
              </div>
              <Button
                type={infoOpen ? "primary" : "default"}
                shape="circle"
                icon={<InfoCircleOutlined />}
                onClick={() => setInfoOpen((v) => !v)}
                aria-label="Thông tin hội thoại"
                className="chat-detail__topbar-info-btn"
              />
            </div>
            <ChatWindow
              data={conversation}
              currentUserId={0}
            />
          </div>
        </div>
        {infoOpen ? (
          <div className="chat-window-layout__info">
            <ChatInfoPanel
              conversation={conversation}
              onClose={() => setInfoOpen(false)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
