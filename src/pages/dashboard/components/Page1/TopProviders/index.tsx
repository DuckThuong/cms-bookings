import type { CmsDashboardTopProvider } from "@/api/dtos/dashboard.dto";
import { Empty } from "antd";

const EMOJIS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

type TopProvidersProps = {
  items: CmsDashboardTopProvider[];
  scope: "platform" | "company";
};

const TopProviders = ({ items, scope }: TopProvidersProps) => {
  const isCompanyScope = scope === "company";

  return (
    <div className="chart-panel" style={{ minHeight: 320 }}>
      <div className="chart-panel__header">
        <div>
          <div className="chart-panel__title">
            {isCompanyScope ? "Top Tuyến" : "Top Nhà xe"}
          </div>
          <div className="chart-panel__subtitle">Doanh thu kỳ hiện tại</div>
        </div>
      </div>

      {items.length === 0 ? (
        <Empty description="Chưa có dữ liệu xếp hạng" />
      ) : (
        <div>
          {items.map((provider, idx) => (
            <div className="provider-rank-item" key={provider.rank}>
              <div
                className={`provider-rank-item__rank ${idx === 0 ? "provider-rank-item__rank--top" : ""}`}
              >
                {EMOJIS[idx] ?? `${provider.rank}`}
              </div>
              <div className="provider-rank-item__logo">🚌</div>
              <div className="provider-rank-item__info">
                <div className="provider-rank-item__name">{provider.name}</div>
                <div className="provider-rank-item__trips">
                  {provider.trips.toLocaleString("vi-VN")} chuyến
                </div>
              </div>
              <div style={{ flex: 2, paddingRight: 12 }}>
                <div className="provider-rank-item__bar-wrap">
                  <div className="fill" style={{ width: `${provider.pct}%` }} />
                </div>
              </div>
              <div className="provider-rank-item__revenue">{provider.revenue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProviders;
