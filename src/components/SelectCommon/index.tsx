import { Form, Select } from "antd";
import type { FormItemProps } from "antd";
import "./style.scss";
import type { SelectOptionProps } from "../../common/types/common";

interface SelectCommonProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOptionProps[];
  formItemProps?: FormItemProps;
  onChange?: (value: any) => void;
  allowClear?: boolean;
  showSearch?: boolean;
  mode?: "multiple" | "tags";
  size?: "large" | "middle" | "small";
}

export const SelectCommon = ({
  name,
  label,
  placeholder,
  disabled = false,
  options,
  formItemProps,
  onChange,
  allowClear = true,
  showSearch = true,
  mode,
  size = "middle",
}: SelectCommonProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      className="form-select"
      {...formItemProps}
    >
      <Select
        placeholder={placeholder || `Chọn ${label.toLowerCase()}`}
        disabled={disabled}
        allowClear={allowClear}
        showSearch={showSearch}
        mode={mode}
        size={size}
        onChange={onChange}
        filterOption={(input, option) =>
          (option?.label ?? "")
            .toString()
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={options}
      />
    </Form.Item>
  );
};
