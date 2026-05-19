import { InputPhoneNumber } from "@pages/auth/component/InputPhoneNumber";
import { Checkbox, Form, Input, type FormInstance } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../style.scss";
import profileIcn from "@/assets/icons/profile.svg";
import { ROUTER_PATH } from "@/routers/Route";
interface SignInProps {
  form: FormInstance;
}

type SignInStep1Data = {
  eyebrow: string;
  fullName: {
    label: string;
    name: string;
    requiredMessage: string;
    placeholder: string;
    iconAlt: string;
  };
  terms: {
    requiredMessage: string;
    tosLabel: string;
    privacyLabel: string;
  };
};

const SIGNIN_STEP1_DATA: SignInStep1Data = {
  eyebrow: "Bước 1 / 3 — Thông tin tài khoản",
  fullName: {
    label: "Họ và tên",
    name: "name",
    requiredMessage: "Vui lòng nhập họ tên của bạn",
    placeholder: "Nhập họ và tên của bạn",
    iconAlt: "profile icon",
  },
  terms: {
    requiredMessage: "Bạn cần đồng ý điều khoản",
    tosLabel: "Điều khoản sử dụng",
    privacyLabel: "Chính sách bảo mật",
  },
};

export const Step1 = (props: SignInProps) => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  return (
    <>
      <div className="signin-header">
        <p className="signin-header__eyebrow">{SIGNIN_STEP1_DATA.eyebrow}</p>
      </div>
      <div className="signin-form">
        <Form.Item
          label={SIGNIN_STEP1_DATA.fullName.label}
          name={SIGNIN_STEP1_DATA.fullName.name}
          rules={[
            {
              required: true,
              message: SIGNIN_STEP1_DATA.fullName.requiredMessage,
            },
          ]}
        >
          <Input
            type="text"
            size="large"
            placeholder={SIGNIN_STEP1_DATA.fullName.placeholder}
            prefix={
              <img
                src={profileIcn}
                alt={SIGNIN_STEP1_DATA.fullName.iconAlt}
                className="signin-icon--profile"
              />
            }
          />
        </Form.Item>

        <InputPhoneNumber
          value={props.form.getFieldValue("phone")}
          onChange={(value) => props.form.setFieldValue("phone", value)}
          onBlur={(value) => props.form.setFieldValue("phone", value)}
        />

        <Form.Item
          label={"Mật khẩu"}
          name={"password"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu .",
            },
          ]}
        >
          <Input type="password" size="large" placeholder={"Mật Khẩu."} />
        </Form.Item>

        <Form.Item
          label={"Xác nhận mật khẩu"}
          name={"confirm_password"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu .",
            },
          ]}
        >
          <Input type="password" size="large" placeholder={"Mật Khẩu."} />
        </Form.Item>
      </div>
      <Form.Item
        name="acceptRole"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error(SIGNIN_STEP1_DATA.terms.requiredMessage),
                  ),
          },
        ]}
        className="signin-terms-form"
      >
        <Checkbox className="signin-terms-checkbox">
          <span className="signin-terms__text">
            Tôi đồng ý với{" "}
            <Link to={ROUTER_PATH.SUPPORT}>
              {SIGNIN_STEP1_DATA.terms.tosLabel}
            </Link>{" "}
            và{" "}
            <Link to={ROUTER_PATH.SUPPORT}>
              {SIGNIN_STEP1_DATA.terms.privacyLabel}
            </Link>{" "}
            của GoRide. Thông tin của bạn được bảo vệ theo tiêu chuẩn cao nhất.
          </span>
        </Checkbox>
      </Form.Item>
    </>
  );
};
