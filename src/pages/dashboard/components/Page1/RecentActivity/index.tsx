import type { CmsDashboardActivity } from "@/api/dtos/dashboard.dto";
import { Empty } from "antd";

type RecentActivityProps = {
  items: CmsDashboardActivity[];
};

const RecentActivity = ({ items }: RecentActivityProps) => (
  <div className="chart-panel" style={{ minHeight: 320 }}>
    <div className="chart-panel__header">
      <div>
        <div className="chart-panel__title">Hoạt động gần đây</div>
        <div className="chart-panel__subtitle">Cập nhật realtime</div>
      </div>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 6px #22c55e",
          display: "inline-block",
        }}
      />
    </div>

    {items.length === 0 ? (
      <Empty description="Chưa có hoạt động gần đây" />
    ) : (
      <div className="activity-list">
        {items.map((item) => (
          <div className="activity-item" key={item.id}>
            <div
              className="activity-item__avatar"
              style={{ border: `2px solid ${item.dot}` }}
            >
              {item.initials}
            </div>
            <div className="activity-item__body">
              <div className="activity-item__name">{item.name}</div>
              <div className="activity-item__desc">{item.desc}</div>
            </div>
            <div className="activity-item__time">{item.time}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentActivity;
