import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RefundTable from '../../components/RefundTable';
import RefundDetailDrawer from '../../components/RefundDetailDrawer';
import {
  getRefundRequests,
  processRefund,
} from '@/api/configs/refund.config';
import type { RefundRecord } from '../../share/bookingManagement';
import './style.scss';

const RefundManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);

  const listQuery = useQuery({
    queryKey: ['cmsRefunds'],
    queryFn: () => getRefundRequests(),
  });

  const refundData = listQuery.data?.items ?? [];

  const processMutation = useMutation({
    mutationFn: ({
      refundId,
      action,
      notes,
    }: {
      refundId: number;
      action: 'approve' | 'reject';
      notes?: string;
    }) => processRefund(refundId, action, notes),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['cmsRefunds'] });
      const actionLabel = variables.action === 'approve' ? 'Duyệt' : 'Từ chối';
      message.success(`Đã ${actionLabel} hoàn tiền thành công!`);
      setDrawerOpen(false);
    },
    onError: () => {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    },
  });

  const handleView = (record: RefundRecord) => {
    setSelectedRefund(record);
    setDrawerOpen(true);
  };

  const handleApprove = (record: RefundRecord) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Xác nhận duyệt hoàn tiền',
      icon: <ExclamationCircleOutlined style={{ color: '#22c55e' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn duyệt hoàn tiền cho yêu cầu này?</p>
          <div
            style={{
              background: '#f5f5f5',
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Khách hàng:</span>
              <strong>{record.customer}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Số tiền hoàn:</span>
              <strong style={{ color: '#22c55e' }}>
                {record.refundAmount.toLocaleString('vi-VN')}đ
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Phí hoàn:</span>
              <strong>{100 - record.refundPercentage}%</strong>
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            Hệ thống sẽ hủy vé, giải phóng ghế và tạo yêu cầu hoàn tiền.
          </p>
        </div>
      ),
      okText: 'Duyệt hoàn tiền',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          background: '#22c55e',
          borderColor: '#22c55e',
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      async onOk() {
        await processMutation.mutateAsync({
          refundId: record.refundId,
          action: 'approve',
        });
      },
    });
  };

  const handleReject = (record: RefundRecord) => {
    Modal.confirm({
      className: 'bm-modal',
      title: 'Từ chối hoàn tiền',
      icon: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn từ chối hoàn tiền cho yêu cầu này?</p>
          <div
            style={{
              background: '#f5f5f5',
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Khách hàng:</span>
              <strong>{record.customer}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mã hoàn tiền:</span>
              <strong>{record.refundCode}</strong>
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            Vé của khách sẽ được giữ nguyên trạng thái.
          </p>
        </div>
      ),
      okText: 'Từ chối',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
        style: {
          background: '#ef4444',
          borderColor: '#ef4444',
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      async onOk() {
        await processMutation.mutateAsync({
          refundId: record.refundId,
          action: 'reject',
        });
      },
    });
  };

  const pendingCount = refundData.filter((r) => r.status === 'pending').length;

  return (
    <div className="refund-page">
      <div className="refund-page__header">
        <div className="refund-page__header-left">
          <h2 className="refund-page__title">Yêu cầu hoàn tiền</h2>
          <p className="refund-page__desc">
            Xử lý yêu cầu hoàn tiền từ khách hàng
          </p>
        </div>
        <div className="refund-page__header-right">
          {pendingCount > 0 && (
            <div className="refund-page__pending-badge">
              <span className="refund-page__pending-count">{pendingCount}</span>
              <span>chờ duyệt</span>
            </div>
          )}
        </div>
      </div>

      <div className="refund-page__content">
        <RefundTable
          data={refundData}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={listQuery.isLoading}
        />
      </div>

      <RefundDetailDrawer
        refund={selectedRefund}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default RefundManagementPage;
