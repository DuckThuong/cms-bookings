import React, { useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  drivers,
  fleetStatusOptions,
  fleetTypeOptions,
  routeOptions,
  type AddVehicleFormValues,
  type FleetVehicleRecord,
  type ManagementModalMode,
} from '../../share';
import { fieldStyle, formLabel, numberFieldProps, renderModalFooter } from './shared';

type AddVehicleModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  onClose: () => void;
  initialValues?: FleetVehicleRecord | null;
  onSubmit: (record: FleetVehicleRecord) => void;
};

type VehicleFormShape = Omit<AddVehicleFormValues, 'lastMaintenance' | 'nextMaintenance'> & {
  lastMaintenance: Dayjs;
  nextMaintenance: Dayjs;
};

const createDefaultValues = (): VehicleFormShape => ({
  plateNumber: '',
  type: '',
  seats: 16,
  assignedRoute: '',
  primaryDriver: '',
  status: 'ready',
  lastMaintenance: dayjs(),
  nextMaintenance: dayjs().add(30, 'day'),
  utilizationRate: 0,
  note: '',
});

const AddVehicleModal = ({
  mode = 'create',
  open,
  onClose,
  initialValues,
  onSubmit,
}: AddVehicleModalProps) => {
  const [form] = Form.useForm<VehicleFormShape>();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          plateNumber: initialValues.plateNumber,
          type: initialValues.type,
          seats: initialValues.seats,
          assignedRoute: initialValues.assignedRoute,
          primaryDriver: initialValues.primaryDriver,
          status: initialValues.status,
          lastMaintenance: dayjs(initialValues.lastMaintenance),
          nextMaintenance: dayjs(initialValues.nextMaintenance),
          utilizationRate: initialValues.utilizationRate,
          note: initialValues.note,
        });
        return;
      }

      form.resetFields();
      form.setFieldsValue(createDefaultValues());
      return;
    }

    form.resetFields();
  }, [form, initialValues, isEdit, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    onSubmit({
      key: initialValues?.key ?? `fleet-${Date.now()}`,
      plateNumber: values.plateNumber,
      type: values.type,
      seats: values.seats,
      assignedRoute: values.assignedRoute,
      primaryDriver: values.primaryDriver,
      status: values.status as FleetVehicleRecord['status'],
      lastMaintenance: values.lastMaintenance.format('YYYY-MM-DD'),
      nextMaintenance: values.nextMaintenance.format('YYYY-MM-DD'),
      utilizationRate: values.utilizationRate,
      note: values.note?.trim() ?? '',
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? 'Cập nhật phương tiện' : 'Thêm phương tiện mới'}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: 'Hủy',
        submitText: isEdit ? 'Lưu thay đổi' : 'Thêm phương tiện',
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<VehicleFormShape>
        form={form}
        layout="vertical"
        style={{ padding: '8px 0' }}
        initialValues={createDefaultValues()}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="plateNumber"
              label={formLabel('Biển số')}
              rules={[{ required: true, message: 'Nhập biển số' }]}
            >
              <Input placeholder="51B-999.99" style={fieldStyle} disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel('Trạng thái')}
              rules={[{ required: true, message: 'Chọn trạng thái' }]}
            >
              <Select
                className="bm-select"
                options={fleetStatusOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label={formLabel('Loại xe')}
              rules={[{ required: true, message: 'Chọn loại xe' }]}
            >
              <Select
                className="bm-select"
                options={fleetTypeOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="seats"
              label={formLabel('Số ghế')}
              rules={[{ required: true, message: 'Nhập số ghế' }]}
            >
              <InputNumber min={1} max={60} style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="assignedRoute"
              label={formLabel('Tuyến phụ trách')}
              rules={[{ required: true, message: 'Chọn tuyến phụ trách' }]}
            >
              <Select
                className="bm-select"
                options={routeOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="primaryDriver"
              label={formLabel('Tài xế chính')}
              rules={[{ required: true, message: 'Chọn tài xế chính' }]}
            >
              <Select
                className="bm-select"
                options={drivers.map((driver) => ({ value: driver.name, label: driver.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="utilizationRate"
          label={formLabel('Tỷ lệ sử dụng')}
          rules={[{ required: true, message: 'Nhập tỷ lệ sử dụng' }]}
        >
          <InputNumber min={0} max={100} style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="lastMaintenance"
              label={formLabel('Bảo dưỡng gần nhất')}
              rules={[{ required: true, message: 'Chọn ngày bảo dưỡng gần nhất' }]}
            >
              <DatePicker className="bm-date-picker" style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="nextMaintenance"
              label={formLabel('Bảo dưỡng kế tiếp')}
              rules={[{ required: true, message: 'Chọn ngày bảo dưỡng kế tiếp' }]}
            >
              <DatePicker className="bm-date-picker" style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={formLabel('Ghi chú')}>
          <Input.TextArea rows={3} placeholder="Ghi chú xe..." style={{ ...fieldStyle, resize: 'none' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
