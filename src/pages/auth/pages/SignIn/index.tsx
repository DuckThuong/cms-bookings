import { signUp } from "@/api/configs/auth.config";
import type { SignUpPayloadDto } from "@/api/dtos/auth.dto";
import profileIcn from "@/assets/icons/profile.svg";
import {
  BENEFITS,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
  SUCCESS_MESSAGE,
} from "@/common/constants/constants";
import { Logo } from "@/components/Logo";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Steps } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import back from "../../../../assets/icons/back.svg";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import "./style.scss";

const subTitleMap: Record<number, string> = {
  0: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản GoRide. Bạn vui lòng đảm bảo rằng thông tin bạn cung cấp là chính xác và cập nhật để trải nghiệm dịch vụ tốt nhất.",
  1: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản GoRide. Bạn vui lòng đảm bảo rằng thông tin bạn cung cấp là chính xác và cập nhật để trải nghiệm dịch vụ tốt nhất.",
  2: "Chúng tôi đã gửi mã xác minh đến số điện thoại của bạn. Vui lòng nhập mã có 4 chữ số để hoàn tất đăng ký. Lưu ý: Mã xác minh có hiệu lực trong vòng 5 phút, hãy kiểm tra hộp thư đến của bạn và nhập mã kịp thời để hoàn tất quá trình đăng ký.",
};

export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<SignUpPayloadDto>(null);
  const contentRender = () => {
    switch (step) {
      case 0:
        return <Step1 form={form} />;
      case 1:
        return <Step2 form={form} />;
      default:
        return <Step1 form={form} />;
    }
  };

  const signUpMutation = useMutation({
    mutationFn: (payload: SignUpPayloadDto) => signUp(payload),
    onSuccess: (data) => {
      console.log(data);
      showNotification(SUCCESS_MESSAGE, NOTI_SUCCESS);
      localStorage.setItem('token', data.accessToken);
      navigate(ROUTER_PATH.FINISH);
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

  const handleSubmit = async () => {
    await form.validateFields();

    if (step < 2) {
      const currentValues = form.getFieldsValue();
      setData((prev) => ({ ...prev, ...currentValues }));
      setStep((v) => v + 1);
    } else {
      const finalData: SignUpPayloadDto = {
        ...data,
        ...form.getFieldsValue(),
      };
      setData(finalData);
    }

    if (step === 1) {
      signUpMutation.mutate(data);
    } 
  };

  return (
    <div className="auth-signin">
      {/* Logo */}
      <div className="signin-logo">
        <Logo />
      </div>
      <div className="signin-card">
        <Steps
          current={step}
          items={[
            {
              title: "Tài Khoản",
            },
            {
              title: "Thông Tin Cá Nhân",
            },
            {
              title: "Xác Minh",
            },
          ]}
        />
        <div className="signin-content">
          <div className="signin-header">
            <div className="signin-header__icon">
              <img src={profileIcn} alt="Profile Icon" />
            </div>
            {step > 0 && (
              <img
                src={back}
                onClick={() => {
                  setStep(step - 1);
                }}
                alt="Back"
                className="back"
              />
            )}
          </div>
          <h1 className="signin-header__title">
            Cho chúng tôi
            <br />
            biết về bạn
          </h1>
          <p id="sub-title" className="signin-header__sub">
            {subTitleMap[step]}
          </p>
          <Form form={form} layout="vertical">
            {contentRender()}
          </Form>
        </div>
        <Button
          loading={signUpMutation.isPending}
          type="primary"
          className="signin-btn"
          onClick={handleSubmit}
        >
          Tạo tài khoản
        </Button>

        <p className="signin-login-link">
          Đã có tài khoản?{" "}
          <Link to={ROUTER_PATH.LOGIN} className="signin-login-link__a">
            Đăng nhập ngay
          </Link>
        </p>
        <div className="signin-benefits">
          {BENEFITS.map((b, i) => (
            <div key={i} className="signin-benefits__item">
              <div className="signin-benefits__icon">{b.icon}</div>
              <span className="signin-benefits__text">
                {b.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
