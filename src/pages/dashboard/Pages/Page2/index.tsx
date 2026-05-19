import React, { useMemo, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import VehicleSidebar from '../../components/Page2/VehicaleSideBar';
import BookingToolbar from '../../components/Page2/BookingToolbar';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import BookingTable from '../../components/Page2/BookingTable';
import BookingDetailDrawer from '../../components/Page2/BookingDetailDrawer';
import AddBookingModal from '../../components/Page2/AddBookingModal';
import {
  bookings as initialBookings,
  getBookingStatusTabs,
  getBookingSummaryItems,
  vehicles,
  type BookingRecord,
} from '../../share';
import './style.scss';

const BookingManagementPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [bookingData, setBookingData] = useState<BookingRecord[]>(initialBookings);

  const vehicleLabel = useMemo(() => {
    if (selectedVehicle === 'all') {
      return 'Tất cả xe';
    }

    return vehicles.find((vehicle) => vehicle.id === selectedVehicle)?.label || 'Xe';
  }, [selectedVehicle]);

  const filtered = useMemo(() => {
    return bookingData.filter((booking) => {
      const matchVehicle = selectedVehicle === 'all' || booking.vehicleId === selectedVehicle;
      const matchStatus = activeStatus === 'all' || booking.status === activeStatus;
      const keyword = search.toLowerCase();
      const matchSearch =
        !keyword ||
        booking.customer.toLowerCase().includes(keyword) ||
        booking.id.toLowerCase().includes(keyword) ||
        booking.route.toLowerCase().includes(keyword) ||
        booking.phone.includes(keyword);

      return matchVehicle && matchStatus && matchSearch;
    });
  }, [bookingData, selectedVehicle, activeStatus, search]);

  const statusTabs = useMemo(() => getBookingStatusTabs(bookingData), [bookingData]);
  const summaryItems = useMemo(() => getBookingSummaryItems(filtered), [filtered]);

  const handleView = (record: BookingRecord) => {
    setSelectedBooking(record);
    setDrawerOpen(true);
  };

  const handleConfirm = (record: BookingRecord) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Xác nhận đặt vé',
      icon: <ExclamationCircleOutlined style={{ color: '#3b82f6' }} />,
      content: `Xác nhận đặt vé ${record.id} cho khách ${record.customer}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          background: '#3b82f6',
          borderColor: '#3b82f6',
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        setBookingData((prev) =>
          prev.map((booking) =>
            booking.key === record.key ? { ...booking, status: 'confirmed' } : booking,
          ),
        );
        message.success(`Đã xác nhận vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleCancel = (record: BookingRecord) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Hủy đặt vé',
      icon: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
      content: `Bạn chắc chắn muốn hủy vé ${record.id}?`,
      okText: 'Hủy vé',
      cancelText: 'Không',
      okButtonProps: {
        danger: true,
        style: {
          background: '#ef4444',
          borderColor: '#ef4444',
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        setBookingData((prev) =>
          prev.map((booking) =>
            booking.key === record.key ? { ...booking, status: 'cancelled' } : booking,
          ),
        );
        message.warning(`Đã hủy vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleAddBooking = (values: Record<string, any>) => {
    const seatCount = values.seatCount || 1;
    const newBooking: BookingRecord = {
      key: `bk_new_${Date.now()}`,
      id: `#BK-${20520 + Math.floor(Math.random() * 100)}`,
      vehicleId: values.vehicleId,
      customer: values.customer,
      phone: values.phone,
      route: values.route,
      departure: values.departure?.format('YYYY-MM-DD HH:mm') || '—',
      arrival: '—',
      seats: Array.from({ length: seatCount }, (_, index) => `X${index + 1}`),
      seatCount,
      amount: seatCount * 230000,
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
      <VehicleSidebar selected={selectedVehicle} onChange={setSelectedVehicle} />

      <div className="bm-main">
        <BookingToolbar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          search={search}
          onSearch={setSearch}
          onAddBooking={() => setAddModalOpen(true)}
          vehicleLabel={vehicleLabel}
          totalCount={filtered.length}
          onDateChange={() => {}}
          STATUS_TABS={statusTabs}
        />

        <SummaryStrip items={summaryItems} />

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
