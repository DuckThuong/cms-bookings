import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import type { DriverResponseDto } from "@/api/dtos/driver.dto";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { driverLicenseOptions } from "../../share";

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

const DRIVER_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Dang hoat dong" },
  { value: "INACTIVE", label: "Ngung hoat dong" },
  { value: "MAINTENANCE", label: "Bao duong" },
];

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
      title={isEdit ? "Cap nhat tai xe" : "Them tai xe moi"}
      open={open}
      onCancel={handleClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Huy",
        submitText: isEdit ? "Luu thay doi" : "Them tai xe",
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
              label={formLabel("Ho ten")}
              rules={[{ required: true, message: "Nhap ho ten" }]}
            >
              <Input placeholder="Nguyen Van A" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={formLabel("So dien thoai")}
              rules={[{ required: true, message: "Nhap so dien thoai" }]}
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
                { required: true, message: "Nhap email" },
                { type: "email", message: "Email khong hop le" },
              ]}
            >
              <Input placeholder="driver@example.com" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel("Trang thai")}
              rules={[{ required: true, message: "Chon trang thai" }]}
            >
              <Select className="bm-select" options={DRIVER_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="license"
              label={formLabel("Bang lai")}
              rules={[{ required: true, message: "Chon bang lai" }]}
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
              rules={[{ required: true, message: "Nhap so bang lai" }]}
            >
              <Input
                placeholder="123456"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={formLabel("Mo ta")}>
          <Input.TextArea
            rows={3}
            placeholder="Mo ta tai xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDriverModal;
