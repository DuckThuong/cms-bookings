import { getCmsReports } from "@/api/configs/report.config";
import type { CmsReportItem } from "@/api/dtos/report.dto";
import { DownloadOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Drawer, Input, Select, Spin, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { useReportStatuses } from "@/common/hooks/useMasterData";
import "../Page2/style.scss";
import "../management.scss";

export const renderReportStatus = (
  value: string,
  statusMeta: Record<string, { label: string; color: string; bg: string }>
) => {
  const meta = statusMeta[value];
  if (!meta) return value || "-";
  return (
    <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
      <span className="booking-status__dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
};

const ReportsPage = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<CmsReportItem | null>(null);

  const { reportStatusOptions, reportStatusMeta, reportTypeOptions, reportTypes, loading: masterDataLoading } = useReportStatuses();

  // Convert report types to label map
  const reportTypeLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const rt of reportTypes) {
      map[rt.code] = rt.name;
    }
    return map;
  }, [reportTypes]);

  const reportsQuery = useQuery({
    queryKey: ["cmsReports", search, type, status],
    queryFn: () =>
      getCmsReports({
        search: search.trim() || undefined,
        type: type === "all" ? undefined : type,
        status: status === "all" ? undefined : status,
      }),
  });

  const reports = reportsQuery.data?.items ?? [];

  const columns: ColumnsType<CmsReportItem> = useMemo(
    () => [
      { title: "Báo cáo", key: "name", render: (_, record) => (
        <div>
          <div className="report-type">{record.name}</div>
          <div className="report-subtitle">{reportTypeLabelMap[record.type] ?? record.type} · {record.period}</div>
        </div>
      )},
      { title: "Mã", dataIndex: "id", key: "id", render: (value: string) => (
        <span style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}>{value}</span>
      )},
      { title: "Người tạo", dataIndex: "createdBy", key: "createdBy" },
      { title: "Thời điểm", dataIndex: "createdAt", key: "createdAt" },
      { title: "Trạng thái", dataIndex: "status", key: "status", render: (value: string) => renderReportStatus(value, reportStatusMeta) },
      { title: "", key: "actions", render: (_, record) => (
        <div className="row-actions">
          <Button type="primary" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setSelected(record); }} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={(e) => { e.stopPropagation(); message.success(`Đã tạo tải xuống cho ${record.id}`); }} />
        </div>
      )},
    ],
    [],
  );

  const resetFilters = () => {
    setSearch("");
    setType("all");
    setStatus("all");
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Báo cáo điều hành</div>
        <div className="mgmt-hero__title">Kho báo cáo vận hành và tài chính</div>
        <div className="mgmt-hero__subtitle">Quản lý báo cáo đã sẵn sàng, báo cáo lên lịch và các đầu việc đang sinh file.</div>
      </div>

      {reportsQuery.isError ? (
        <Alert type="error" showIcon message="Không tải được danh sách báo cáo" style={{ marginBottom: 16 }} />
      ) : null}

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách báo cáo</span>
          <span className="bm-toolbar__count">{reports.length} báo cáo</span>
        </div>
        <div className="bm-toolbar__right">
          <Input className="bm-search" placeholder="Tìm mã, tên báo cáo, người tạo..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select className="bm-select" value={type} onChange={setType} options={reportTypeOptions} disabled={masterDataLoading} />
          <Select className="bm-select" value={status} onChange={setStatus} options={reportStatusOptions} disabled={masterDataLoading} />
          <Button className="btn-ghost" icon={<ReloadOutlined />} onClick={resetFilters} />
        </div>
      </div>

      <Spin spinning={reportsQuery.isLoading}>
        <SummaryStrip items={reportsQuery.data?.summary ?? []} />
        <div className="bm-content">
          <div className="bm-table-wrap bm-table">
            <Table rowKey="key" columns={columns} dataSource={reports} pagination={{ pageSize: 6, showSizeChanger: false }} onRow={(record) => ({ onClick: () => setSelected(record) })} />
          </div>
        </div>
      </Spin>

      <Drawer className="booking-drawer" open={Boolean(selected)} onClose={() => setSelected(null)} width={420} title={selected ? `${selected.name} · ${selected.id}` : ""}>
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin báo cáo</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Loại</span><span className="mgmt-detail-list__value">{reportTypeLabelMap[selected.type]}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Khoảng dữ liệu</span><span className="mgmt-detail-list__value">{selected.period}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Người tạo</span><span className="mgmt-detail-list__value">{selected.createdBy}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Kích thước</span><span className="mgmt-detail-list__value">{selected.fileSize}</span></div>
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
