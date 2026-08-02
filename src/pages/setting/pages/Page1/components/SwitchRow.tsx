import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { NotificationSwitchItem } from "../../../../common/constants/profile.constant";
import "./SwitchRow.scss";

interface SwitchRowProps {
  item: NotificationSwitchItem;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export const SwitchRow = ({ item, checked, onChange }: SwitchRowProps) => (
  <div className={`ps-switch-row${checked ? " ps-switch-row--on" : ""}`}>
    <div className="ps-switch-row__icon">{item.icon}</div>
    <div className="ps-switch-row__text">
      <span className="ps-switch-row__label">{item.label}</span>
      <span className="ps-switch-row__desc">{item.desc}</span>
    </div>
    <Switch
      checked={checked}
      onChange={onChange}
      className="ps-switch"
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
    />
  </div>
);
