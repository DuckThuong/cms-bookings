import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import type { DriverResponseDto } from "@/api/dtos/driver.dto";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { driverLicenseOptions, driverStatusOptions } from "../../share";

export type DriverFormValues = {
  name: string;
  license: string;
  licenseNum: string;
  phone: string;
  email: string;
  status: string;
  description?: string;
};

type AddDriverModalProps = {
  open: boolean;
  initialRecord?: DriverResponseDto | null;
  onClose: () => void;
  onSubmit: (values: DriverFormValues) => void;
};

const toFormRecord = (record: DriverResponseDto): DriverFormValues => ({
  licenseNum: record.licenseNum ?? "",
  name: record.name,
  license: record.license,
  phone: record.phone,
  email: record.email,
  status: record.status,
  description: record.description ?? "",
});

const AddDriverModal = ({
  open,
  initialRecord,
  onClose,
  onSubmit,
}: AddDriverModalProps) => {
  const [form] = Form.useForm<DriverFormValues>();
  const isEdit = Boolean(initialRecord);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialRecord) {
      form.setFieldsValue(toFormRecord(initialRecord));
      return;
    }

    form.setFieldsValue({
      name: "",
      phone: "",
      email: "",
      status: "ACTIVE",
      license: "B2",
      licenseNum: "",
      description: "",
    });
  }, [form, initialRecord, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...values,
      description: values.description?.trim() || undefined,
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật tài xế" : "Thêm tài xế mới"}
      open={open}
      onCancel={handleClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Huy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm tài xế",
        onCancel: handleClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<DriverFormValues>
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={formLabel("Họ tên")}
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input placeholder="Nguyen Van A" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={formLabel("Số điện thoại")}
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <Input placeholder="0903000999" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label={formLabel("Email")}
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="driver@example.com" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel("Trạng thái")}
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select className="bm-select" options={driverStatusOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="license"
              label={formLabel("Bằng lái")}
              rules={[{ required: true, message: "Chọn bằng lái" }]}
            >
              <Select
                className="bm-select"
                options={driverLicenseOptions.filter(
                  (item) => item.value !== "all",
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="licenseNum"
              label={formLabel("Số bằng lái")}
              rules={[{ required: true, message: "Nhập số bằng lái" }]}
            >
              <Input placeholder="123456" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={formLabel("Mô tả")}>
          <Input.TextArea
            rows={3}
            placeholder="Mô tả tài xế..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDriverModal;
