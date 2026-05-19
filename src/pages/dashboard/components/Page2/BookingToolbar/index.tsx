// components/booking/BookingToolbar.jsx
import {
    DownloadOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Input, Select } from 'antd';

const { RangePicker } = DatePicker;

interface BookingToolbarProps {
  activeStatus: string;
  onStatusChange: (key: string) => void;
  search: string;
  onSearch: (value: string) => void;
  onDateChange: (dates: [string, string]) => void;
  onAddBooking: () => void;
  vehicleLabel: string;
  totalCount: number;
  STATUS_TABS: { key: string; label: string; color: string; count: number }[];
}

const BookingToolbar = ({
  activeStatus,
  onStatusChange,
  search,
  onSearch,
  onDateChange,
  onAddBooking,
  vehicleLabel,
  totalCount,
  STATUS_TABS,
}: BookingToolbarProps) => {
  return (
    <>
      {/* Top row */}
      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">{vehicleLabel}</span>
          <span className="bm-toolbar__count">{totalCount} đặt vé</span>

          {/* Status tabs */}
          <div className="status-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`status-tabs__tab ${activeStatus === tab.key ? 'status-tabs__tab--active' : ''}`}
                style={
                  activeStatus === tab.key
                    ? { background: `${tab.color}18`, color: tab.color }
                    : {}
                }
                onClick={() => onStatusChange(tab.key)}
              >
                <span
                  className="status-tabs__tab__dot"
                  style={{ background: tab.color }}
                />
                {tab.label}
                <span className="status-tabs__tab__count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            prefix={<SearchOutlined />}
            placeholder="Tìm khách, mã vé, tuyến..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <RangePicker
            className="bm-date-picker"
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => onDateChange(dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : ['', ''])}
            format="DD/MM"
          />

          <Select
            className="bm-select"
            placeholder="Tuyến đường"
            style={{ width: 150 }}
            allowClear
            options={[
              { value: 'hcm-dalat',    label: 'HCM → Đà Lạt' },
              { value: 'hcm-nhatrang', label: 'HCM → Nha Trang' },
              { value: 'hcm-hanoi',    label: 'HCM → Hà Nội' },
              { value: 'hcm-vungtau', label: 'HCM → Vũng Tàu' },
            ]}
          />

          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            style={{ height: 34, borderRadius: 8 }}
          />

          <Button
            className="btn-ghost"
            icon={<DownloadOutlined />}
            style={{ height: 34, borderRadius: 8 }}
          >
            Xuất
          </Button>

          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={onAddBooking}
          >
            Thêm đặt vé
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingToolbar;