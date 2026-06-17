import { useState } from "react";
import {
  OperationStatusKey,
  OPERATION_STATUS_META,
} from "../../share";
import { CmsTripItem } from "@/api/dtos/trip.dto";
import { NOTI_ERROR, NOTI_SUCCESS } from "@/common/constants/constants";
import { updateOperationStatus } from "@/api/configs/trip.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TripEndpoint } from "@/api/endpoints/trip.endpoint";
import { useNotification } from "@/providers/notificationProvider";
import { Modal, Select, Spin } from "antd";
import { useEffect } from "react";

type TripOperationStatusModalProps = {
  open: boolean;
  trip: CmsTripItem | null;
  onClose: () => void;
};

const MAIN_STATUS_ORDER: OperationStatusKey[] = [
  "SCHEDULED",
  "PREPARING",
  "BOARDING",
  "DEPARTED",
  "APPROACHING",
  "MOVING",
  "ARRIVED",
  "COMPLETED",
];

const ALL_STATUSES: OperationStatusKey[] = [
  ...MAIN_STATUS_ORDER,
  "CANCELLED",
  "DELAYED",
];

export const TripOperationStatusModal = ({
  open,
  trip,
  onClose,
}: TripOperationStatusModalProps) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    trip?.operationStatus
  );

  useEffect(() => {
    if (trip) {
      setSelectedStatus(trip.operationStatus);
    }
  }, [trip]);

  const updateMutation = useMutation({
    mutationFn: (operationStatus: string) =>
      updateOperationStatus({
        id: trip!.id,
        operationStatus,
      }),
    onSuccess: () => {
      showNotification("Cập nhật trạng thái vận hành thành công", NOTI_SUCCESS);
      void queryClient.invalidateQueries({
        queryKey: [TripEndpoint.GET_ALL_TRIPS],
      });
      onClose();
    },
    onError: () => {
      showNotification("Cập nhật trạng thái vận hành thất bại", NOTI_ERROR);
    },
  });

  const handleOk = () => {
    if (!selectedStatus || selectedStatus === trip?.operationStatus) {
      onClose();
      return;
    }
    updateMutation.mutate(selectedStatus);
  };

  if (!trip) return null;

  const currentIndex = trip.operationStatus
    ? MAIN_STATUS_ORDER.indexOf(trip.operationStatus as OperationStatusKey)
    : -1;

  // Filter options: show from current status onwards + special statuses (CANCELLED, DELAYED)
  const availableStatuses = ALL_STATUSES.filter((status) => {
    // Always show CANCELLED and DELAYED
    if (status === "CANCELLED" || status === "DELAYED") return true;
    // Show statuses from current to end
    const statusIndex = MAIN_STATUS_ORDER.indexOf(status);
    if (currentIndex < 0) return true; // No current status, show all
    return statusIndex >= currentIndex;
  });

  const statusOptions = availableStatuses.map((status) => ({
    value: status,
    label: OPERATION_STATUS_META[status]?.label || status,
  }));

  return (
    <Modal
      className="bm-modal"
      title={`Mã: ${trip.code} - Tên: ${trip.name || trip.roadName || "—"}`}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={updateMutation.isPending}
      okButtonProps={{
        disabled:
          !selectedStatus || selectedStatus === trip.operationStatus,
      }}
    >
      <Spin spinning={updateMutation.isPending}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 16, color: "#64748b", fontSize: 13 }}>
            Trạng thái hiện tại:{" "}
            <span
              style={{
                color: OPERATION_STATUS_META[
                  trip.operationStatus as OperationStatusKey
                ]?.color,
                fontWeight: 500,
              }}
            >
              {OPERATION_STATUS_META[
                trip.operationStatus as OperationStatusKey
              ]?.label || "Chưa cập nhật"}
            </span>
          </p>

          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "rgba(59,130,246,0.08)",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
              Trình tự trạng thái:
            </p>
            <div
              style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {MAIN_STATUS_ORDER.map((status, index) => {
                const meta = OPERATION_STATUS_META[status];
                const isActive = status === trip.operationStatus;
                const isPast = currentIndex > index;

                // Ẩn các trạng thái tương lai (chưa đến lượt)
                if (currentIndex >= 0 && index > currentIndex) {
                  return null;
                }

                return (
                  <div
                    key={status}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      background: isActive
                        ? meta.color
                        : isPast
                          ? "rgba(100,116,139,0.2)"
                          : "transparent",
                      color: isActive
                        ? "#fff"
                        : isPast
                          ? "#64748b"
                          : "#94a3b8",
                      border: isActive
                        ? `1px solid ${meta.color}`
                        : "1px dashed #94a3b8",
                    }}
                  >
                    {meta.label}
                  </div>
                );
              })}
            </div>
          </div>

          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#334155",
            }}
          >
            Cập nhật trạng thái vận hành:
          </label>
          <Select
            style={{ width: "100%" }}
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Chọn trạng thái vận hành"
          />
        </div>
      </Spin>
    </Modal>
  );
};
