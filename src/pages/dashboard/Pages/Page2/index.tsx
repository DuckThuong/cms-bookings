import React, { useState, useMemo } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import VehicleSidebar     from '../../components/Page2/VehicaleSideBar';
import BookingToolbar     from '../../components/Page2/BookingToolbar';
import SummaryStrip       from '../../components/Page2/SummaryStrip';
import BookingTable       from '../../components/Page2/BookingTable';
import BookingDetailDrawer from '../../components/Page2/BookingDetailDrawer';
import AddBookingModal    from '../../components/Page2/AddBookingModal';
import { bookings as initialBookings, vehicles } from '../../share/bookingManagement';
import './style.scss';


const BookingManagementPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [activeStatus, setActiveStatus]       = useState('all');
  const [search, setSearch]                   = useState('');
  const [drawerOpen, setDrawerOpen]           = useState(false);
  const [addModalOpen, setAddModalOpen]       = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingData, setBookingData]         = useState(initialBookings);
  const vehicleLabel = useMemo(() => {
    if (selectedVehicle === 'all') return 'Tất cả xe';
    return vehicles.find((v) => v.id === selectedVehicle)?.label || 'Xe';
  }, [selectedVehicle]);

  const filtered = useMemo(() => {
    return bookingData.filter((b) => {
      const matchVehicle = selectedVehicle === 'all' || b.vehicleId === selectedVehicle;
      const matchStatus  = activeStatus === 'all'    || b.status === activeStatus;
      const q = search.toLowerCase();
      const matchSearch  = !q
        || b.customer.toLowerCase().includes(q)
        || b.id.toLowerCase().includes(q)
        || b.route.toLowerCase().includes(q)
        || b.phone.includes(q);
      return matchVehicle && matchStatus && matchSearch;
    });
  }, [bookingData, selectedVehicle, activeStatus, search]);

  // ── Handlers
  const handleView = (record: any) => {
    setSelectedBooking(record);
    setDrawerOpen(true);
  };

  const handleConfirm = (record: any) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Xác nhận đặt vé',
      icon: <ExclamationCircleOutlined style={{ color: '#3b82f6' }} />,
      content: `Xác nhận đặt vé ${record.id} cho khách ${record.customer}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { style: { background: '#3b82f6', borderColor: '#3b82f6', borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        setBookingData((prev) =>
          prev.map((b) => b.key === record.key ? { ...b, status: 'confirmed' } : b)
        );
        message.success(`Đã xác nhận vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleCancel = (record: any) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Huỷ đặt vé',
      icon: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
      content: `Bạn chắc chắn muốn huỷ vé ${record.id}?`,
      okText: 'Huỷ vé',
      cancelText: 'Không',
      okButtonProps: {
        danger: true,
        style: { background: '#ef4444', borderColor: '#ef4444', borderRadius: 8 },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        setBookingData((prev) =>
          prev.map((b) => b.key === record.key ? { ...b, status: 'cancelled' } : b)
        );
        message.warning(`Đã huỷ vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleAddBooking = (values: any) => {
    const newBooking = {
      key: `bk_new_${Date.now()}`,
      id: `#BK-${20520 + Math.floor(Math.random() * 100)}`,
      vehicleId: values.vehicleId,
      customer: values.customer,
      phone: values.phone,
      route: values.route,
      departure: values.departure?.format('YYYY-MM-DD HH:mm') || '—',
      arrival: '—',
      seats: Array.from({ length: values.seatCount || 1 }, (_, i) => `X${i + 1}`),
      seatCount: values.seatCount || 1,
      amount: (values.seatCount || 1) * 230000,
      status: 'pending',
      bookedAt: new Date().toLocaleString('vi-VN'),
      note: values.note || '',
      pickup: values.pickup || '—',
      dropoff: values.dropoff || '—',
    };
    setBookingData((prev) => [newBooking, ...prev]);
    message.success('Đã tạo đặt vé mới!');
  };

  return (
    <div className="bm-page">
      {/* ── Left Sidebar: Vehicle List */}
      <VehicleSidebar
        selected={selectedVehicle}
        onChange={setSelectedVehicle}
      />

      {/* ── Right: Main Panel */}
      <div className="bm-main">
        {/* Toolbar */}
        <BookingToolbar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          search={search}
          onSearch={setSearch}
          onAddBooking={() => setAddModalOpen(true)}
          vehicleLabel={vehicleLabel}
          totalCount={filtered.length}
          onDateChange={() => {}}
          STATUS_TABS={[]}
        />

        {/* Summary strip */}
        <SummaryStrip items={[]} />

        {/* Table */}
        <div className="bm-content">
          <BookingTable
            data={filtered}
            onView={handleView}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            loading={false}
          />
        </div>
      </div>

      <BookingDetailDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <AddBookingModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddBooking}
        defaultVehicle={selectedVehicle}
      />
    </div>
  );
};

export default BookingManagementPage;