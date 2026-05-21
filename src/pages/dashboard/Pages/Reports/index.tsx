import React, { useMemo, useState } from 'react';
import { Button, Drawer, Input, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  REPORT_STATUS_META,
  getReportSummary,
  reports,
  reportStatusOptions,
  reportTypeOptions,
  type ReportRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const reportTypeLabel: Record<ReportRecord['type'], string> = {
  operations: 'Vận hành',
  finance: 'Tài chính',
  customer: 'Khách hàng',
  compliance: 'Tuân thủ',
};

const ReportsPage = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<ReportRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return reports.filter((report) => {
      const matchKeyword =
        !keyword ||
        report.name.toLowerCase().includes(keyword) ||
        report.id.toLowerCase().includes(keyword) ||
        report.createdBy.toLowerCase().includes(keyword);
      const matchType = type === 'all' || report.type === type;
      const matchStatus = status === 'all' || report.status === status;
      return matchKeyword && matchType && matchStatus;
    });
  }, [search, type, status]);

  const columns: ColumnsType<ReportRecord> = [
    {
      title: 'Báo cáo',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="report-type">{record.name}</div>
          <div className="report-subtitle">
            {reportTypeLabel[record.type]} · {record.period}
          </div>
        </div>
      ),
    },
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Thời điểm', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: ReportRecord['status']) => {
        const meta = REPORT_STATUS_META[value];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="row-actions">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelected(record);
            }}
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              message.success(`Đã tạo tải xuống cho ${record.id}`);
            }}
          >
            <DownloadOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Báo cáo điều hành</div>
        <div className="mgmt-hero__title">Kho báo cáo vận hành và tài chính</div>
        <div className="mgmt-hero__subtitle">
          Quản lý báo cáo đã sẵn sàng, báo cáo lên lịch và các đầu việc đang sinh file.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách báo cáo</span>
          <span className="bm-toolbar__count">{filtered.length} báo cáo</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm mã, tên báo cáo, người tạo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select className="bm-select" value={type} onChange={setType} options={reportTypeOptions} />
          <Select className="bm-select" value={status} onChange={setStatus} options={reportStatusOptions} />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch('');
              setType('all');
              setStatus('all');
            }}
          />
        </div>
      </div>

      <SummaryStrip items={getReportSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey="key"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            onRow={(record) => ({ onClick: () => setSelected(record) })}
          />
        </div>
      </div>

      <Drawer
        className="booking-drawer"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={420}
        title={selected ? `${selected.name} · ${selected.id}` : ''}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin báo cáo</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Loại</span>
                  <span className="mgmt-detail-list__value">{reportTypeLabel[selected.type]}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Khoảng dữ liệu</span>
                  <span className="mgmt-detail-list__value">{selected.period}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Người tạo</span>
                  <span className="mgmt-detail-list__value">{selected.createdBy}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Kích thước</span>
                  <span className="mgmt-detail-list__value">{selected.fileSize}</span>
                </div>
              </div>
              <div className="mgmt-note">{selected.description}</div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ReportsPage;
