import { signIn } from "@/api/configs/auth.config";
import { Role, type LoginPayloadDto } from "@/api/dtos/auth.dto";
import { useAuth } from "@/common/contexts/authContext";
import { Logo } from "@/components/Logo";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputPhoneNumber } from "../../component/InputPhoneNumber";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
  SUCCESS_MESSAGE,
} from "./../../../../common/constants/constants";
import "./style.scss";

export const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const { setAuthSession } = useAuth();
  const [phone, setPhone] = useState("");

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayloadDto) => signIn(payload),
    onSuccess: (data) => {
      setAuthSession(data);

      if (data.role === Role.ADMIN || data.role === Role.CUSTOMER) {
        showNotification(SUCCESS_MESSAGE, NOTI_SUCCESS);
        navigate(ROUTER_PATH.DASHBOARD);
      } else {
        showNotification("Vai trò không hợp lệ", NOTI_ERROR);
      }
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onSettled: () => {
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const handleSubmit = (values: { phone: string; password: string }) => {
    const payload: LoginPayloadDto = {
      phoneNumber: values.phone,
      password: values.password,
    };
    loginMutation.mutate(payload);
  };

  return (
    <div className="auth-login">
      <div className="login-logo">
        <Logo />
      </div>

      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__icon">
            <svg viewBox="0 0 26 26" fill="none">
              <rect
                x="5"
                y="2"
                width="16"
                height="22"
                rx="3"
                fill="#f5a623"
                fillOpacity="0.15"
              />
              <rect
                x="5"
                y="2"
                width="16"
                height="22"
                rx="3"
                stroke="#f5a623"
                strokeWidth="1.5"
              />
              <circle cx="13" cy="20" r="1.5" fill="#f5a623" />
              <rect
                x="9"
                y="5"
                width="8"
                height="1.5"
                rx="0.75"
                fill="#f5a623"
                fillOpacity="0.5"
              />
            </svg>
          </div>
          <p className="login-card__eyebrow">Xác thực tài khoản</p>
          <h1 className="login-card__title">
            Nhập số điện
            <br />
            thoại của bạn
          </h1>
          <p className="login-card__sub">
            Chúng tôi sẽ gửi mã OTP để xác nhận danh tính và bảo vệ tài khoản
            của bạn.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="login-form"
          onFinish={handleSubmit}
        >
          <InputPhoneNumber
            value={phone}
            onChange={(value) => setPhone(value)}
            onBlur={(value) => setPhone(value)}
          />

          <Form.Item
            label={"Mật khẩu"}
            name={"password"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu đăng nhập",
              },
            ]}
          >
            <Input
              type="password"
              size="large"
              placeholder={"Mật Khẩu Đăng Nhập"}
            />
          </Form.Item>

          <Button
            loading={loginMutation.isPending}
            htmlType="submit"
            className={`login-btn`}
          >
            Đăng nhập
            <span className="arrow"> →</span>
          </Button>
        </Form>
      </div>

      <div className="login-trust">
        <div className="login-trust__item">
          <span className="login-trust__num">2M+</span>
          <span className="login-trust__label">Chuyến xe</span>
        </div>
        <div className="login-trust__sep" />
        <div className="login-trust__item">
          <span className="login-trust__num">500K</span>
          <span className="login-trust__label">Người dùng</span>
        </div>
        <div className="login-trust__sep" />
        <div className="login-trust__item">
          <span className="login-trust__num">4.9★</span>
          <span className="login-trust__label">Đánh giá</span>
        </div>
      </div>
    </div>
  );
};
