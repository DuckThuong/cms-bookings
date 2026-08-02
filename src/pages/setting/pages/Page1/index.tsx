import { useState } from "react";
import { Button, Form, Select, Tag } from "antd";
import {
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  CheckOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { SwitchRow, StatsCard } from "./components";
import "./style.scss";
import { ALERT_ITEMS, CHANNEL_ITEMS, INITIAL_NOTIFICATION_SETTINGS, type NotificationChannelKey, type NotificationSettings } from "@/common/constants/profile.constant";

export const Settings = () => {
  const [form] = Form.useForm();
  const [values, setValues] = useState<NotificationSettings>(INITIAL_NOTIFICATION_SETTINGS);

  const toggle = (key: NotificationChannelKey) =>
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    console.log("Saved settings:", values);
  };

  const handleReset = () => {
    setValues(INITIAL_NOTIFICATION_SETTINGS);
    form.resetFields();
  };

  const activeCount = Object.entries(values).filter(([k, v]) => {
    if (k === "preferredContact") return false;
    return v === true;
  }).length;

  const totalCount = Object.keys(values).filter(k => k !== "preferredContact").length;

  const CONTACT_OPTIONS = [
    { value: "email", label: "Email", icon: <MailOutlined /> },
    { value: "sms", label: "SMS", icon: <MessageOutlined /> },
    { value: "phone", label: "Cuộc gọi", icon: <PhoneOutlined /> },
  ];

  return (
    <div className="profile-settings">
      {/* ── Hero banner ──────────────────────────────────── */}
      <div className="ps-hero">
        <div className="ps-hero__icon">
          <BellOutlined />
        </div>
        <div className="ps-hero__info">
          <div className="ps-hero__greeting">Cài đặt</div>
          <div className="ps-hero__title">Thông báo</div>
          <div className="ps-hero__desc">
            Quản lý kênh và loại thông báo bạn muốn nhận từ GoRide
          </div>
        </div>
        <Tag className="ps-hero__badge" bordered={false} icon={<CheckOutlined />}>
          {activeCount}/{totalCount} đang bật
        </Tag>
      </div>

      {/* ── Stats summary ───────────────────────────────── */}
      <div className="ps-stats">
        <StatsCard
          icon={<MailOutlined />}
          label="Kênh đã bật"
          value={`${activeCount}`}
          sub={`trong tổng ${totalCount} kênh`}
          color="#f5a623"
        />
        <StatsCard
          icon={<BellOutlined />}
          label="Trạng thái"
          value={activeCount > 0 ? "Hoạt động" : "Tắt"}
          sub={activeCount > 0 ? "Đang nhận thông báo" : "Không nhận thông báo"}
          color={activeCount > 0 ? "#16a34a" : "#6b7280"}
        />
        <StatsCard
          icon={<PhoneOutlined />}
          label="Liên hệ ưu tiên"
          value={values.preferredContact === "email" ? "Email" : values.preferredContact === "sms" ? "SMS" : "Cuộc gọi"}
          sub="Phương thức ưu tiên"
          color="#3b82f6"
        />
      </div>

      {/* ── Channel section ─────────────────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-bell" />
          Kênh nhận thông báo
        </p>
        {CHANNEL_ITEMS.map((item) => (
          <SwitchRow
            key={item.key}
            item={item}
            checked={values[item.key]}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* ── Alert section ───────────────────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-alarm" />
          Cảnh báo & nhắc nhở
        </p>
        {ALERT_ITEMS.map((item) => (
          <SwitchRow
            key={item.key}
            item={item}
            checked={values[item.key]}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* ── Preferred contact section ───────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-phone" />
          Liên hệ ưu tiên
        </p>
        <Form form={form} layout="vertical" className="ps-form">
          <Form.Item
            name="preferredContact"
            initialValue={values.preferredContact}
            style={{ marginBottom: 0 }}
          >
            <div className="ps-contact-row">
              {CONTACT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`ps-contact-btn${values.preferredContact === opt.value ? " ps-contact-btn--active" : ""}`}
                  onClick={() =>
                    setValues((prev) => ({
                      ...prev,
                      preferredContact:
                        opt.value as NotificationSettings["preferredContact"],
                    }))
                  }
                >
                  <span className="ps-contact-btn__icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Form.Item>
        </Form>
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
      <div className="ps-actions">
        <Button
          className="ps-actions__reset"
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          Đặt lại
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          className="ps-actions__save"
          onClick={handleSave}
        >
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
};
