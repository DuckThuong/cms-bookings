import { CountDown } from "@/components/CountDown";
import OTPInput from "@/components/FormOtp/formOtp";
import { Logo } from "@/components/Logo";
import { ROUTER_PATH } from "@/routers/Route";
import { Button, Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import privacyIcn from "@/assets/icons/privacy.svg";

type OtpConfirmPageData = {
  otpLength: number;
  countdownSeconds: number;
  maxAttempts: number;
  maskedPhone: string;
  otpRuleRequired: string;
  otpRuleLen: string;
};

const OTP_CONFIRM_PAGE_DATA: OtpConfirmPageData = {
  otpLength: 6,
  countdownSeconds: 60,
  maxAttempts: 3,
  maskedPhone: "098 765 4321",
  otpRuleRequired: "Vui lòng nhập mã OTP!",
  otpRuleLen: "Mã OTP gồm đúng 6 chữ số.",
};

export const OtpConfirm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(0);
  const [seconds, setSeconds] = useState(
    OTP_CONFIRM_PAGE_DATA.countdownSeconds,
  );
  const [canResend, setCanResend] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    clearInterval(timerRef.current!);
    setSeconds(OTP_CONFIRM_PAGE_DATA.countdownSeconds);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleResend = () => {
    if (!canResend) return;
    form.resetFields();
    setWrongAttempts(0);
    setStatus(0);
    startTimer();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setStatus(1);

      setTimeout(() => {
        if (values.otp === "123456") {
          setStatus(2);
        } else {
          const newAttempts = wrongAttempts + 1;
          setWrongAttempts(newAttempts);
          setStatus(3);
          setTimeout(() => {
            form.resetFields();
            setStatus(0);
          }, 1200);
        }
        navigate(ROUTER_PATH.FINISH);
      }, 1600);
    } catch {}
  };

  const CIRCUMFERENCE = 2 * Math.PI * 22;
  const strokeOffset =
    CIRCUMFERENCE * (1 - seconds / OTP_CONFIRM_PAGE_DATA.countdownSeconds);
  const isUrgent = seconds <= 15;

  const btnLabel =
    status === 1
      ? "Đang xác thực..."
      : status === 2
        ? "✓ Thành công!"
        : "Xác nhận";

  return (
    <div className="auth__otp">
      <div className="auth__logo">
        <Logo />
      </div>

      <div className="auth__otp-card">
        <Form form={form} className="auth__otp-form" onFinish={handleSubmit}>
          <div className="otp-header__icon-wrap">
            <div className="otp-header__icon">
              <svg viewBox="0 0 36 36" fill="none">
                <rect
                  x="4"
                  y="6"
                  width="28"
                  height="24"
                  rx="4"
                  stroke="#f5a623"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 18h12M12 13h6"
                  stroke="#f5a623"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="14"
                  y="22"
                  width="8"
                  height="4"
                  rx="1"
                  fill="#f5a623"
                  fillOpacity=".3"
                />
              </svg>
            </div>
            <div className="otp-header__badge">✦</div>
          </div>

          <p className="otp-header__eyebrow">Xác thực OTP</p>
          <h1 className="otp-header__title">Nhập mã xác thực</h1>
          <p className="otp-header__sub">
            Chúng tôi đã gửi mã 6 chữ số đến
            <br />
            <strong>{OTP_CONFIRM_PAGE_DATA.maskedPhone}</strong>
          </p>

          <Form.Item
            name="otp"
            className="otp-form-item"
            rules={[
              {
                required: true,
                message: OTP_CONFIRM_PAGE_DATA.otpRuleRequired,
              },
              {
                len: OTP_CONFIRM_PAGE_DATA.otpLength,
                message: OTP_CONFIRM_PAGE_DATA.otpRuleLen,
              },
            ]}
          >
            <OTPInput length={OTP_CONFIRM_PAGE_DATA.otpLength} />
          </Form.Item>

          <CountDown
            seconds={seconds}
            CIRCUMFERENCE={CIRCUMFERENCE}
            strokeOffset={strokeOffset}
            isUrgent={isUrgent}
          />

          <div className="otp-resend">
            <Button
              type="link"
              className={`otp-resend__btn${canResend ? " otp-resend__btn--active" : ""}`}
              disabled={!canResend}
              onClick={handleResend}
            >
              Không nhận được mã?{" "}
              {canResend ? "Gửi lại ngay" : `Gửi lại sau ${seconds}s`}
            </Button>
          </div>
        </Form>
      </div>

      <div className="auth__otp-action">
        <Button
          type="primary"
          block
          className={`otp-btn${status === 2 ? " otp-btn--success" : ""}`}
          loading={status === 1}
          disabled={status === 1 || status === 2}
          onClick={handleSubmit}
        >
          {btnLabel}
        </Button>

        <p className="otp-back">
          Nhập sai số?{" "}
          <Button
            type="link"
            className="otp-back__link"
            href={ROUTER_PATH.LOGIN}
          >
            Đổi số điện thoại
          </Button>
        </p>

        <div className="otp-security">
          <img
            src={privacyIcn}
            alt="Privacy Icon"
            className="otp-security__icon"
          />
          <p>
            Mã OTP chỉ có hiệu lực một lần. GoRide không bao giờ hỏi mã này qua
            điện thoại.
          </p>
        </div>
      </div>
    </div>
  );
};
