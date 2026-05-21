import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  drivers,
  fleetStatusOptions,
  fleetTypeOptions,
  routeOptions,
  type FleetVehicleRecord,
} from "../../share";
import { numberFieldProps } from "@/common/contexts/format";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";

type AddVehicleModalProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (record: any) => void;
};

const AddVehicleModal = ({
  id,
  open,
  onClose,
  onSubmit,
}: AddVehicleModalProps) => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (id || id != "") {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    const submitData = {
      name: form.getFieldValue("name"),
      plateNumber: form.getFieldValue("plateNumber"),
      seatType: form.getFieldValue("seatType"),
      status: form.getFieldValue("status"),
      type: form.getFieldValue("type"),
      seats: form.getFieldValue("seats"),
      assignedRoute: form.getFieldValue("assignedRoute"),
      primaryDriver: form.getFieldValue("primaryDriver"),
    };
    onSubmit(submitData);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật phương tiện" : "Thêm phương tiện mới"}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm phương tiện",
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form form={form} layout="vertical" style={{ padding: "8px 0" }}>
        <Row gutter={12}>
          <Col xs={24} md={24}>
            <Form.Item
              name="name"
              label={formLabel("Tên xe")}
              rules={[{ required: true, message: "Nhập tên xe" }]}
            >
              <Input
                placeholder="Tên xe"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} md={24}>
            <Form.Item
              name="name"
              label={formLabel("Biển số xe")}
              rules={[{ required: true, message: "Nhập biển số xe" }]}
            >
              <Input
                placeholder="Biển số xe"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatType"
              label={formLabel("Loại xe")}
              rules={[{ required: true, message: "Nhập loại xe " }]}
            >
              <Select
                className="bm-select"
                options={fleetStatusOptions.filter(
                  (item) => item.value !== "all",
                )}
              />
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
                options={fleetStatusOptions.filter(
                  (item) => item.value !== "all",
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label={formLabel("Loại ghế")}
              rules={[{ required: true, message: "Chọn loại ghế" }]}
            >
              <Select
                className="bm-select"
                options={fleetTypeOptions.filter(
                  (item) => item.value !== "all",
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="seats"
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

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="assignedRoute"
              label={formLabel("Tuyến phụ trách")}
              rules={[{ required: true, message: "Chọn tuyến phụ trách" }]}
            >
              <Select
                className="bm-select"
                options={routeOptions.filter((item) => item.value !== "all")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="primaryDriver"
              label={formLabel("Tài xế chính")}
              rules={[{ required: true, message: "Chọn tài xế chính" }]}
            >
              <Select
                className="bm-select"
                options={drivers.map((driver) => ({
                  value: driver.name,
                  label: driver.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="utilizationRate"
          label={formLabel("Tỷ lệ sử dụng")}
          rules={[{ required: true, message: "Nhập tỷ lệ sử dụng" }]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{ ...fieldStyle, width: "100%" }}
            {...numberFieldProps}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="lastMaintenance"
              label={formLabel("Bảo dưỡng gần nhất")}
              rules={[
                { required: true, message: "Chọn ngày bảo dưỡng gần nhất" },
              ]}
            >
              <DatePicker
                className="bm-date-picker"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="nextMaintenance"
              label={formLabel("Bảo dưỡng kế tiếp")}
              rules={[
                { required: true, message: "Chọn ngày bảo dưỡng kế tiếp" },
              ]}
            >
              <DatePicker
                className="bm-date-picker"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={formLabel("Ghi chú")}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
