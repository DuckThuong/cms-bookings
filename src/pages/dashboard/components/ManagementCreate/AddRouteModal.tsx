import type { IRoad } from "@/api/dtos/route.dto";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import { numberFieldProps } from "@/common/contexts/format";
import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { routeStatusOptions, type ManagementModalMode } from "../../share";

export type RouteFormValues = {
  name: string;
  length: number;
  pickUpPoint: string;
  dropOffPoint: string;
  status: string;
  standardDuration: string;
  tripsPerDay: number;
  averageOccupancy: number;
  estimatedRevenue: number;
  leadVehicle: string;
  demandLevel: string;
  note?: string;
};

type AddRouteModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  onClose: () => void;
  initialValues?: IRoad | null;
  onSubmit: (values: RouteFormValues) => void;
};

const defaultValues: RouteFormValues = {
  name: "",
  length: 1,
  pickUpPoint: "",
  dropOffPoint: "",
  standardDuration: "",
  tripsPerDay: 1,
  averageOccupancy: 0,
  estimatedRevenue: 0,
  status: "ACTIVE",
  leadVehicle: "",
  demandLevel: "",
  note: "",
};

const AddRouteModal = ({
  mode = "create",
  open,
  onClose,
  initialValues,
  onSubmit,
}: AddRouteModalProps) => {
  const [form] = Form.useForm<RouteFormValues>();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          length: initialValues.length,
          pickUpPoint: initialValues.pickUpPoint,
          dropOffPoint: initialValues.dropOffPoint,
          standardDuration: initialValues.standardDuration ?? "",
          tripsPerDay: initialValues.tripsPerDay ?? 1,
          averageOccupancy: initialValues.averageOccupancy ?? 0,
          estimatedRevenue: initialValues.estimatedRevenue ?? 0,
          status: initialValues.status,
          leadVehicle: initialValues.leadVehicle ?? "",
          demandLevel: initialValues.demandLevel ?? "",
          note: initialValues.note ?? "",
        });
        return;
      }

      form.resetFields();
      form.setFieldsValue(defaultValues);
      return;
    }

    form.resetFields();
  }, [form, initialValues, isEdit, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit({ ...values, note: values.note?.trim() ?? "" });
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật tuyến đường" : "Thêm tuyến đường mới"}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm tuyến đường",
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
        initialValues={defaultValues}
      >
        <Form.Item
          name="name"
          label={formLabel("Tên tuyến đường")}
          rules={[{ required: true, message: "Vui lòng nhập tên tuyến đường" }]}
        >
          <Input placeholder="Hà Nội - Hải Phòng" style={fieldStyle} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="pickUpPoint"
              label={formLabel("Điểm đón khách")}
              rules={[
                { required: true, message: "Vui lòng nhập điểm đón khách" },
              ]}
            >
              <Input placeholder="BigC Thăng Long" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="dropOffPoint"
              label={formLabel("Điểm trả khách")}
              rules={[
                { required: true, message: "Vui lòng nhập điểm trả khách" },
              ]}
            >
              <Input placeholder="Ga Hải Phòng" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="length"
              label={formLabel("Chiều dài quãng đường (km)")}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chiều dài quãng đường",
                },
              ]}
            >
              <InputNumber
                min={1}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="standardDuration"
              label={formLabel("Thời gian di chuyển(h:mm)")}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian di chuyển",
                },
              ]}
            >
              <Input placeholder="3h30" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        {mode === "edit" && (
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label={formLabel("Trạng thái")}
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select
                  className="bm-select"
                  options={routeStatusOptions.filter(
                    (item) => item.value !== "all",
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item name="note" label={formLabel("Ghi chú")}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú tuyến..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRouteModal;
