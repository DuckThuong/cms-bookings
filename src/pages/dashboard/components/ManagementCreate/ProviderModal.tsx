import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { numberFieldProps } from "@/common/contexts/format";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import {
  providerStatusOptions,
  type ProviderRecord,
  type ProviderStatusKey,
} from "../../share";

type ProviderFormValues = {
  name: string;
  hotline: string;
  email: string;
  routeCount: number;
  vehicleCount: number;
  status: ProviderStatusKey;
  joinedAt: string;
  note: string;
};

type ProviderModalProps = {
  open: boolean;
  initialRecord?: ProviderRecord | null;
  onClose: () => void;
  onSubmit: (record: ProviderFormValues) => void;
};

const ProviderModal = ({
  open,
  initialRecord,
  onClose,
  onSubmit,
}: ProviderModalProps) => {
  const [form] = Form.useForm<ProviderFormValues>();
  const isEdit = Boolean(initialRecord);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialRecord) {
      form.setFieldsValue(initialRecord);
      return;
    }

    form.setFieldsValue({
      routeCount: 0,
      vehicleCount: 0,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      note: "",
    });
  }, [form, initialRecord, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit(values);
    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật nhà xe" : "Thêm nhà xe mới"}
      open={open}
      onCancel={handleClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm nhà xe",
        onCancel: handleClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form form={form} layout="vertical" style={{ padding: "8px 0" }}>
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={formLabel("Tên nhà xe")}
              rules={[{ required: true, message: "Nhập tên nhà xe" }]}
            >
              <Input placeholder="Tên nhà xe" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel("Trạng thái")}
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select
                className="bm-select"
                options={providerStatusOptions.filter((item) => item.value !== "all")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="hotline"
              label={formLabel("Hotline")}
              rules={[{ required: true, message: "Nhập hotline" }]}
            >
              <Input placeholder="1900..." style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label={formLabel("Email")}
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="contact@example.com" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item
              name="routeCount"
              label={formLabel("Số tuyến")}
              rules={[{ required: true, message: "Nhập số tuyến" }]}
            >
              <InputNumber min={0} style={{ ...fieldStyle, width: "100%" }} {...numberFieldProps} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="vehicleCount"
              label={formLabel("Số xe")}
              rules={[{ required: true, message: "Nhập số xe" }]}
            >
              <InputNumber min={0} style={{ ...fieldStyle, width: "100%" }} {...numberFieldProps} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="joinedAt"
              label={formLabel("Ngày tham gia")}
              rules={[{ required: true, message: "Nhập ngày tham gia" }]}
            >
              <Input placeholder="YYYY-MM-DD" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={formLabel("Ghi chú")}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú nhà xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProviderModal;
