import {
  confirmCmsBooking,
  getCmsBookings,
  rejectCmsBooking,
} from "@/api/configs/booking.config";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useMemo, useState } from "react";
import AddBookingModal from "../../components/Page2/AddBookingModal";
import BookingDetailDrawer from "../../components/Page2/BookingDetailDrawer";
import BookingTable from "../../components/Page2/BookingTable";
import BookingToolbar from "../../components/Page2/BookingToolbar";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import VehicleSidebar from "../../components/Page2/VehicleSideBar";
import {
  getBookingStatusTabs,
  getBookingSummaryItems,
  type BookingRecord,
  type BookingStatusKey,
} from "../../share";
import "./style.scss";

const BookingManagementPage = () => {
  const queryClient = useQueryClient();
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [activeStatus, setActiveStatus] = useState<BookingStatusKey | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null,
  );

  const listQuery = useQuery({
    queryKey: ["cmsBookings", selectedVehicle, activeStatus, search],
    queryFn: () =>
      getCmsBookings({
        status: activeStatus,
        vehicleId: selectedVehicle === "all" ? undefined : selectedVehicle,
        search: search.trim() || undefined,
      }),
  });

  const bookingData = listQuery.data?.items ?? [];
  const vehicles = listQuery.data?.vehicles ?? [];

  const vehicleLabel = useMemo(() => {
    if (selectedVehicle === "all") {
      return "Tất cả xe";
    }

    return (
      vehicles.find((vehicle) => vehicle.id === selectedVehicle)?.label ?? "Xe"
    );
  }, [selectedVehicle, vehicles]);

  const statusTabs = useMemo(
    () => getBookingStatusTabs(bookingData),
    [bookingData],
  );
  const summaryItems = useMemo(
    () => getBookingSummaryItems(bookingData),
    [bookingData],
  );

  const confirmMutation = useMutation({
    mutationFn: (paymentId: number) => confirmCmsBooking(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cmsBookings"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (paymentId: number) => rejectCmsBooking(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cmsBookings"] });
    },
  });

  const handleView = (record: BookingRecord) => {
    setSelectedBooking(record);
    setDrawerOpen(true);
  };

  const handleConfirm = (record: BookingRecord) => {
    if (record.paymentId == null) return;

    Modal.confirm({
      className: "bm-modal",
      title: "Xác nhận đặt vé",
      icon: <ExclamationCircleOutlined style={{ color: "#3b82f6" }} />,
      content: `Xác nhận đặt vé ${record.id} cho khách ${record.customer}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          background: "#3b82f6",
          borderColor: "#3b82f6",
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      async onOk() {
        await confirmMutation.mutateAsync(record.paymentId);
        message.success(`Đã xác nhận vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleCancel = (record: BookingRecord) => {
    if (record.paymentId == null) return;

    Modal.confirm({
      className: "bm-modal",
      title: "Từ chối đặt vé",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn từ chối vé ${record.id}?`,
      okText: "Từ chối",
      cancelText: "Không",
      okButtonProps: {
        danger: true,
        style: {
          background: "#ef4444",
          borderColor: "#ef4444",
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      async onOk() {
        await rejectMutation.mutateAsync(record.paymentId);
        message.warning(`Đã từ chối vé ${record.id}`);
        setDrawerOpen(false);
      },
    });
  };

  const handleAddBooking = () => {
    message.info("Khách hàng đặt vé qua ứng dụng — đơn sẽ hiển thị ở trạng thái Chờ xác nhận");
    setAddModalOpen(false);
  };

  return (
    <div className="bm-page">
      <VehicleSidebar
        vehicles={vehicles}
        selected={selectedVehicle}
        onChange={setSelectedVehicle}
      />

      <div className="bm-main">
        <BookingToolbar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          search={search}
          onSearch={setSearch}
          onAddBooking={() => setAddModalOpen(true)}
          vehicleLabel={vehicleLabel}
          totalCount={bookingData.length}
          onDateChange={() => {}}
          STATUS_TABS={statusTabs}
        />

        <SummaryStrip items={summaryItems} />

        <div className="bm-content">
          <BookingTable
            data={bookingData}
            onView={handleView}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            loading={listQuery.isLoading}
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
