import { numberFieldProps } from "@/common/contexts/format";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import type { IVerhicalItem } from "@/api/dtos/vehical.dto";
import { Col, Form, Input, InputNumber, Modal, Row, Select, TimePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect } from "react";

export type VehicleFormValues = {
  vehicalName: string;
  vehicalCode: string;
  seatType: string;
  seatCount: number;
  vehicalType: string;
  vehicalStatus: string;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  pricePerSeat: number;
};

type AddVehicleModalProps = {
  open: boolean;
  initialRecord?: IVerhicalItem | null;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
};

const VEHICAL_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
  { value: "MAINTENANCE", label: "Bảo dưỡng" },
];

const VEHICAL_TYPE_OPTIONS = [
  { value: "SLEEPER", label: "Xe giường nằm" },
  { value: "LIMOUSINE", label: "Xe limousine" },
  { value: "COACH", label: "Xe khách" },
];

const SEAT_TYPE_OPTIONS = [
  { value: "GIUONG", label: "Giường nằm" },
  { value: "NGOI", label: "Ghế ngồi" },
];

type VehicleFormFields = VehicleFormValues & {
  timeStartPicker: Dayjs;
  timeEndPicker: Dayjs;
};

const toFormRecord = (record: IVerhicalItem): VehicleFormFields => ({
  vehicalName: record.verhical.name,
  vehicalCode: record.verhical.code,
  seatType: record.seatType,
  seatCount: record.seatCount,
  vehicalType: record.verhical.type,
  vehicalStatus: record.verhical.status,
  schedule: record.verhical.schedule,
  description: record.verhical.description ?? "",
  timeStart: record.timeStart,
  timeEnd: record.timeEnd,
  pricePerSeat: 0,
  timeStartPicker: dayjs(record.timeStart, "HH:mm"),
  timeEndPicker: dayjs(record.timeEnd, "HH:mm"),
});

const toSubmitValues = (fields: VehicleFormFields): VehicleFormValues => ({
  vehicalName: fields.vehicalName,
  vehicalCode: fields.vehicalCode,
  seatType: fields.seatType,
  seatCount: fields.seatCount,
  vehicalType: fields.vehicalType,
  vehicalStatus: fields.vehicalStatus,
  schedule: fields.schedule,
  description: fields.description ?? "",
  timeStart: fields.timeStartPicker.format("HH:mm"),
  timeEnd: fields.timeEndPicker.format("HH:mm"),
  pricePerSeat: fields.pricePerSeat ?? 0,
});

const AddVehicleModal = ({
  open,
  initialRecord,
  onClose,
  onSubmit,
}: AddVehicleModalProps) => {
  const [form] = Form.useForm<VehicleFormFields>();
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
      vehicalName: "",
      vehicalCode: "",
      seatType: "GIUONG",
      seatCount: 34,
      vehicalType: "SLEEPER",
      vehicalStatus: "ACTIVE",
      schedule: "",
      description: "",
      timeStart: "08:00",
      timeEnd: "14:30",
      pricePerSeat: 0,
      timeStartPicker: dayjs("08:00", "HH:mm"),
      timeEndPicker: dayjs("14:30", "HH:mm"),
    });
  }, [form, initialRecord, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit(toSubmitValues(values));
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
      <Form form={form} layout="vertical" style={{ padding: "8px 0" }}>
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicalName"
              label={formLabel("Tên xe")}
              rules={[{ required: true, message: "Nhập tên xe" }]}
            >
              <Input placeholder="Xe giường nằm 34 chỗ" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicalCode"
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
              name="vehicalType"
              label={formLabel("Loại xe")}
              rules={[{ required: true, message: "Chọn loại xe" }]}
            >
              <Select className="bm-select" options={VEHICAL_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicalStatus"
              label={formLabel("Trạng thái")}
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select
                className="bm-select"
                options={VEHICAL_STATUS_OPTIONS}
              />
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
                max={60}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="schedule"
          label={formLabel("Lịch trình / tuyến")}
          rules={[{ required: true, message: "Nhập lịch trình" }]}
        >
          <Input placeholder="Hà Nội - Đà Nẵng" style={fieldStyle} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="timeStartPicker"
              label={formLabel("Giờ đi")}
              rules={[{ required: true, message: "Chọn giờ đi" }]}
            >
              <TimePicker
                className="bm-date-picker"
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="timeEndPicker"
              label={formLabel("Giờ đến")}
              rules={[{ required: true, message: "Chọn giờ đến" }]}
            >
              <TimePicker
                className="bm-date-picker"
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="pricePerSeat"
          label={formLabel("Giá mỗi ghế")}
          rules={[{ required: true, message: "Nhập giá mỗi ghế" }]}
        >
          <InputNumber
            min={0}
            style={{ ...fieldStyle, width: "100%" }}
            {...numberFieldProps}
          />
        </Form.Item>

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
