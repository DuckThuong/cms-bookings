import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import { numberFieldProps } from "@/common/contexts/format";
import type { IVehicle } from "@/api/dtos/vehicle.dto";
import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";

export type VehicleFormValues = {
  vehicleName: string;
  vehicleCode: string;
  seatType: string;
  seatCount: number;
  vehicleType: string;
  vehicleStatus: string;
  schedule?: string;
  description?: string;
};

type AddVehicleModalProps = {
  open: boolean;
  initialRecord?: IVehicle | null;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
};

const VEHICLE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
  { value: "MAINTENANCE", label: "Bảo dưỡng" },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: "SLEEPER", label: "Xe giường nằm" },
  { value: "LIMOUSINE", label: "Xe Limousine" },
  { value: "COACH", label: "Xe Khách" },
];

const SEAT_TYPE_OPTIONS = [
  { value: "BED", label: "Giường nằm" },
  { value: "SEAT", label: "Ghế ngồi" },
];

const toFormRecord = (record: IVehicle): VehicleFormValues => ({
  vehicleName: record.name,
  vehicleCode: record.code,
  seatType: record.seatType || "BED",
  seatCount: record.seatCount || 1,
  vehicleType: record.type,
  vehicleStatus: record.status,
  schedule: record.schedule ?? "",
  description: record.description ?? "",
});

const AddVehicleModal = ({
  open,
  initialRecord,
  onClose,
  onSubmit,
}: AddVehicleModalProps) => {
  const [form] = Form.useForm<VehicleFormValues>();
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
      vehicleName: "",
      vehicleCode: "",
      seatType: "BED",
      seatCount: 34,
      vehicleType: "SLEEPER",
      vehicleStatus: "ACTIVE",
      schedule: "",
      description: "",
    });
  }, [form, initialRecord, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...values,
      schedule: values.schedule?.trim() || undefined,
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
      title={isEdit ? "Cập nhật phương tiện" : "Thêm phương tiện mới"}
      open={open}
      onCancel={handleClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm phương tiện",
        onCancel: handleClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<VehicleFormValues>
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleName"
              label={formLabel("Tên xe")}
              rules={[{ required: true, message: "Nhập tên xe" }]}
            >
              <Input placeholder="Xe giường nằm cao cấp" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleCode"
              label={formLabel("Biển số")}
              rules={[{ required: true, message: "Nhập biển số" }]}
            >
              <Input
                placeholder="29B-2325"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleType"
              label={formLabel("Loại xe")}
              rules={[{ required: true, message: "Chọn loại xe" }]}
            >
              <Select className="bm-select" options={VEHICLE_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleStatus"
              label={formLabel("Trạng thái")}
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select className="bm-select" options={VEHICLE_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatType"
              label={formLabel("Loại ghế")}
              rules={[{ required: true, message: "Chọn loại ghế" }]}
            >
              <Select className="bm-select" options={SEAT_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatCount"
              label={formLabel("Số ghế")}
              rules={[{ required: true, message: "Nhập số ghế" }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={formLabel("Mô tả")}>
          <Input.TextArea
            rows={3}
            placeholder="Mô tả xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
