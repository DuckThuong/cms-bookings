import { formatPhone } from "@/common/contexts/format";
import { Form, Input, Select } from "antd";
import "./InputPhoneNumber.scss";

interface InputPhoneNumberProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}

type InputPhoneNumberData = {
  label: string;
  name: string;
  requiredMessage: string;
  placeholder: string;
  regions: Array<{ key: number; value: string; label: string }>;
  defaultRegion: string;
};

const INPUT_PHONE_DATA: InputPhoneNumberData = {
  label: "Số điện thoại",
  name: "phone",
  requiredMessage: "Vui lòng nhập số điện thoại của bạn",
  placeholder: "Nhập số điện thoại của bạn",
  regions: [
    { key: 1, value: "VN", label: "+84" },
    { key: 2, value: "US", label: "+80" },
  ],
  defaultRegion: "VN",
};

export const InputPhoneNumber: React.FC<InputPhoneNumberProps> = (
  props: InputPhoneNumberProps,
) => {
  const { value, onChange, onBlur } = props;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatPhone(e.target.value));
  };
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(formatPhone(e.target.value));
  };

  return (
    <Form.Item
      label={INPUT_PHONE_DATA.label}
      name={INPUT_PHONE_DATA.name}
      rules={[{ required: true, message: INPUT_PHONE_DATA.requiredMessage }]}
    >
      <Input
        type="tel"
        placeholder={INPUT_PHONE_DATA.placeholder}
        autoComplete="tel"
        size="large"
        value={value}
        maxLength={13}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />
    </Form.Item>
  );
};
