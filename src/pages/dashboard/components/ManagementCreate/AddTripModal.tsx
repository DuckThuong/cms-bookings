import React, { useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  drivers,
  routeOptions,
  tripStatusOptions,
  type AddTripFormValues,
  type ManagementModalMode,
  type TripRecord,
  vehicleOptions,
} from '../../share';
import { fieldStyle, formLabel, numberFieldProps, renderModalFooter } from './shared';

type AddTripModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  onClose: () => void;
  initialValues?: TripRecord | null;
  onSubmit: (record: TripRecord) => void;
};

type TripFormShape = Omit<AddTripFormValues, 'departure' | 'arrival'> & {
  departure: Dayjs;
  arrival: Dayjs;
};

const createDefaultValues = (): TripFormShape => ({
  id: '',
  route: '',
  vehicle: '',
  driver: '',
  departure: dayjs(),
  arrival: dayjs().add(7, 'hour'),
  capacity: 45,
  bookedSeats: 0,
  status: 'scheduled',
  note: '',
});

const AddTripModal = ({
  mode = 'create',
  open,
  onClose,
  initialValues,
  onSubmit,
}: AddTripModalProps) => {
  const [form] = Form.useForm<TripFormShape>();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          id: initialValues.id,
          route: initialValues.route,
          vehicle: initialValues.vehicle,
          driver: initialValues.driver,
          departure: dayjs(initialValues.departure),
          arrival: dayjs(initialValues.arrival),
          capacity: initialValues.capacity,
          bookedSeats: initialValues.bookedSeats,
          status: initialValues.status,
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
    const occupancyRate = values.capacity
      ? Math.round((values.bookedSeats / values.capacity) * 100)
      : 0;

    onSubmit({
      key: initialValues?.key ?? `trip-${Date.now()}`,
      id: values.id,
      route: values.route,
      vehicle: values.vehicle,
      driver: values.driver,
      departure: values.departure.format('YYYY-MM-DD HH:mm'),
      arrival: values.arrival.format('YYYY-MM-DD HH:mm'),
      bookedSeats: values.bookedSeats,
      capacity: values.capacity,
      occupancyRate,
      status: values.status as TripRecord['status'],
      note: values.note?.trim() ?? '',
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? 'Cập nhật chuyến xe' : 'Thêm chuyến xe mới'}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: 'Hủy',
        submitText: isEdit ? 'Lưu thay đổi' : 'Thêm chuyến xe',
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<TripFormShape>
        form={form}
        layout="vertical"
        style={{ padding: '8px 0' }}
        initialValues={createDefaultValues()}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="id"
              label={formLabel('Mã chuyến')}
              rules={[{ required: true, message: 'Nhập mã chuyến' }]}
            >
              <Input placeholder="TRP-2201" style={fieldStyle} disabled={isEdit} />
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
                options={tripStatusOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="route"
              label={formLabel('Tuyến')}
              rules={[{ required: true, message: 'Chọn tuyến' }]}
            >
              <Select
                className="bm-select"
                options={routeOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicle"
              label={formLabel('Xe')}
              rules={[{ required: true, message: 'Chọn xe' }]}
            >
              <Select
                className="bm-select"
                options={vehicleOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="driver"
          label={formLabel('Tài xế')}
          rules={[{ required: true, message: 'Chọn tài xế' }]}
        >
          <Select
            className="bm-select"
            options={drivers.map((driver) => ({ value: driver.name, label: driver.name }))}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="departure"
              label={formLabel('Giờ khởi hành')}
              rules={[{ required: true, message: 'Chọn giờ khởi hành' }]}
            >
              <DatePicker
                className="bm-date-picker"
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="arrival"
              label={formLabel('Giờ đến')}
              rules={[{ required: true, message: 'Chọn giờ đến' }]}
            >
              <DatePicker
                className="bm-date-picker"
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="capacity"
              label={formLabel('Sức chứa')}
              rules={[{ required: true, message: 'Nhập sức chứa' }]}
            >
              <InputNumber min={1} max={60} style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="bookedSeats"
              label={formLabel('Số ghế đã đặt')}
              dependencies={['capacity']}
              rules={[
                { required: true, message: 'Nhập số ghế đã đặt' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const capacity = getFieldValue('capacity');
                    if (typeof value !== 'number' || typeof capacity !== 'number' || value <= capacity) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Số ghế đã đặt không được vượt quá sức chứa'));
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={60} style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={formLabel('Ghi chú')}>
          <Input.TextArea rows={3} placeholder="Ghi chú vận hành..." style={{ ...fieldStyle, resize: 'none' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTripModal;
