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
  startPoint: string;
  endPoint: string;
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
  startPoint: "",
  endPoint: "",
  standardDuration: "",
  tripsPerDay: 1,
  averageOccupancy: 50,
  estimatedRevenue: 1,
  status: "active",
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
          startPoint: initialValues.startPoint,
          endPoint: initialValues.endPoint,
          standardDuration: initialValues.standardDuration ?? "",
          tripsPerDay: initialValues.tripsPerDay ?? 1,
          averageOccupancy: initialValues.averageOccupancy ?? 50,
          estimatedRevenue: initialValues.estimatedRevenue ?? 1,
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
      title={isEdit ? "Cap nhat tuyen duong" : "Them tuyen duong moi"}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Huy",
        submitText: isEdit ? "Luu thay doi" : "Them tuyen duong",
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<RouteFormValues>
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
        initialValues={defaultValues}
      >
        <Form.Item
          name="name"
          label={formLabel("Ten tuyen")}
          rules={[{ required: true, message: "Nhap ten tuyen" }]}
        >
          <Input placeholder="HCM -> Da Lat" style={fieldStyle} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="startPoint"
              label={formLabel("Diem dau")}
              rules={[{ required: true, message: "Nhap diem dau" }]}
            >
              <Input placeholder="HCM" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="endPoint"
              label={formLabel("Diem cuoi")}
              rules={[{ required: true, message: "Nhap diem cuoi" }]}
            >
              <Input placeholder="Da Lat" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="length"
              label={formLabel("Quang duong (km)")}
              rules={[{ required: true, message: "Nhap quang duong" }]}
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
              label={formLabel("Thoi luong chuan")}
            >
              <Input placeholder="7h30" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="tripsPerDay" label={formLabel("So chuyen/ngay")}>
              <InputNumber
                min={0}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel("Trang thai")}
              rules={[{ required: true, message: "Chon trang thai" }]}
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

        

        <Form.Item name="note" label={formLabel("Ghi chu")}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chu tuyen..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRouteModal;
