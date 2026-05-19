import { DatePicker, Form, Input, type FormInstance } from "antd";
import { useState } from "react";
import "../style.scss";
import mailIcn from "@/assets/icons/mail.svg";
interface SignInProps {
  form: FormInstance;
}

type SignInStep2Data = {
  eyebrow: string;
  email: {
    label: string;
    name: string;
    requiredMessage: string;
    placeholder: string;
    iconAlt: string;
  };
  dob: {
    label: string;
    name: string;
    requiredMessage: string;
    format: string;
  };
  gender: {
    label: string;
    name: string;
    requiredMessage: string;
    options: Array<{ value: string; emoji: string; label: string }>;
  };
};

const SIGNIN_STEP2_DATA: SignInStep2Data = {
  eyebrow: "Bước 2 / 3 — Thông tin cá nhân",
  email: {
    label: "Email",
    name: "email",
    requiredMessage: "Vui lòng nhập địa chỉ email của bạn",
    placeholder: "Nhập địa chỉ email của bạn",
    iconAlt: "mail icon",
  },
  dob: {
    label: "Ngày sinh",
    name: "dateOfBirth",
    requiredMessage: "Vui lòng nhập ngày sinh của bạn",
    format: "DD/MM/YYYY",
  },
  gender: {
    label: "Giới tính",
    name: "gender",
    requiredMessage: "Vui lòng chọn giới tính",
    options: [
      { value: "1", emoji: "👨", label: "Nam" },
      { value: "2", emoji: "👩", label: "Nữ" },
      { value: "3", emoji: "🧑", label: "Khác" },
    ],
  },
};

export const Step2 = (props: SignInProps) => {
  const [gender, setGender] = useState<string>("");

  return (
    <div className="signIn__step-2">
      <div className="signin-header">
        <p className="signin-header__eyebrow">{SIGNIN_STEP2_DATA.eyebrow}</p>
      </div>

      <div className="signin-form">
        <Form.Item
          label={SIGNIN_STEP2_DATA.email.label}
          name={SIGNIN_STEP2_DATA.email.name}
          rules={[
            { required: true, message: SIGNIN_STEP2_DATA.email.requiredMessage },
          ]}
        >
          <Input
            type="text"
            size="large"
            placeholder={SIGNIN_STEP2_DATA.email.placeholder}
            prefix={
              <img
                src={mailIcn}
                alt={SIGNIN_STEP2_DATA.email.iconAlt}
                className="signin-icon--mail"
              />
            }
          />
        </Form.Item>

        <Form.Item
          label={SIGNIN_STEP2_DATA.dob.label}
          name={SIGNIN_STEP2_DATA.dob.name}
          rules={[
            { required: true, message: SIGNIN_STEP2_DATA.dob.requiredMessage },
          ]}
        >
          <DatePicker
            format={SIGNIN_STEP2_DATA.dob.format}
            className="signin-date-full"
            size="large"
          />
        </Form.Item>
      </div>

      <Form.Item
        name={SIGNIN_STEP2_DATA.gender.name}
        rules={[
          {
            required: true,
            message: SIGNIN_STEP2_DATA.gender.requiredMessage,
          },
        ]}
      >
        <div className="signin-field">
          <label className="signin-field__label">{SIGNIN_STEP2_DATA.gender.label}</label>

          <div className="signin-gender">
            {SIGNIN_STEP2_DATA.gender.options?.map((opt) => (
              <div
                key={opt.value}
                className={`signin-gender__opt ${
                  gender === opt.value ? "signin-gender__opt--selected" : ""
                }`}
                onClick={() => {
                  setGender(opt.value);
                  props.form.setFieldValue("gender", opt.value);
                }}
              >
                <div className="signin-gender__radio">
                  <div className="signin-gender__dot" />
                </div>

                <span className="signin-gender__emoji">{opt.emoji}</span>

                <span className="signin-gender__text">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Form.Item>
    </div>
  );
};
