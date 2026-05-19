// src/components/dashboard/TopProviders.jsx
import React from 'react';
import { topProviders } from '@/pages/dashboard/share';

const EMOJIS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

const TopProviders = () => (
  <div className="chart-panel" style={{ minHeight: 320 }}>
    <div className="chart-panel__header">
      <div>
        <div className="chart-panel__title">Top Nhà xe</div>
        <div className="chart-panel__subtitle">Doanh thu tháng này</div>
      </div>
    </div>

    <div>
      {topProviders.map((p: any, idx: number) => (
        <div className="provider-rank-item" key={p.rank}>
          <div className={`provider-rank-item__rank ${idx === 0 ? 'provider-rank-item__rank--top' : ''}`}>
            {EMOJIS[idx]}
          </div>
          <div className="provider-rank-item__logo">🚌</div>
          <div className="provider-rank-item__info">
            <div className="provider-rank-item__name">{p.name}</div>
            <div className="provider-rank-item__trips">{p.trips.toLocaleString()} chuyến</div>
          </div>
          <div style={{ flex: 2, paddingRight: 12 }}>
            <div className="provider-rank-item__bar-wrap">
              <div
                className="fill"
                style={{ width: `${p.pct}%` }}
              />
            </div>
          </div>
          <div className="provider-rank-item__revenue">{p.revenue}</div>
        </div>
      ))}
    </div>
  </div>
);

export default TopProviders;