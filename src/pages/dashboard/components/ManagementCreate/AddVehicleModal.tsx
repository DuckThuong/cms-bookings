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
  { value: "ACTIVE", label: "Dang hoat dong" },
  { value: "INACTIVE", label: "Ngung hoat dong" },
  { value: "MAINTENANCE", label: "Bao duong" },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: "SLEEPER", label: "Xe giuong nam" },
  { value: "LIMOUSINE", label: "Xe limousine" },
  { value: "COACH", label: "Xe khach" },
];

const SEAT_TYPE_OPTIONS = [
  { value: "GIUONG", label: "Giuong nam" },
  { value: "NGOI", label: "Ghe ngoi" },
];

const toFormRecord = (record: IVehicle): VehicleFormValues => ({
  vehicleName: record.name,
  vehicleCode: record.code,
  seatType: record.seatType || "GIUONG",
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
      seatType: "GIUONG",
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
      title={isEdit ? "Cap nhat phuong tien" : "Them phuong tien moi"}
      open={open}
      onCancel={handleClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Huy",
        submitText: isEdit ? "Luu thay doi" : "Them phuong tien",
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
              label={formLabel("Ten xe")}
              rules={[{ required: true, message: "Nhap ten xe" }]}
            >
              <Input placeholder="Xe giuong nam 34 cho" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleCode"
              label={formLabel("Bien so")}
              rules={[{ required: true, message: "Nhap bien so" }]}
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
              label={formLabel("Loai xe")}
              rules={[{ required: true, message: "Chon loai xe" }]}
            >
              <Select className="bm-select" options={VEHICLE_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleStatus"
              label={formLabel("Trang thai")}
              rules={[{ required: true, message: "Chon trang thai" }]}
            >
              <Select className="bm-select" options={VEHICLE_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatType"
              label={formLabel("Loai ghe")}
              rules={[{ required: true, message: "Chon loai ghe" }]}
            >
              <Select className="bm-select" options={SEAT_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatCount"
              label={formLabel("So ghe")}
              rules={[{ required: true, message: "Nhap so ghe" }]}
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

        <Form.Item name="schedule" label={formLabel("Lich trinh / tuyen")}>
          <Input placeholder="Ha Noi - Da Nang" style={fieldStyle} />
        </Form.Item>

        <Form.Item name="description" label={formLabel("Mo ta")}>
          <Input.TextArea
            rows={3}
            placeholder="Mo ta xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
