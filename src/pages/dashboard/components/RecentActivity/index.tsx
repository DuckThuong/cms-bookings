// src/components/dashboard/RecentActivity.jsx
import React from 'react';
import { recentActivities, STATUS_COLORS } from '@/pages/dashboard/share';

const RecentActivity = () => (
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
          borderRadius: '50%',
          background: STATUS_COLORS.completed,
          boxShadow: `0 0 6px ${STATUS_COLORS.completed}`,
          display: 'inline-block',
        }}
      />
    </div>

    <div className="activity-list">
      {recentActivities.map((item: any) => (
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
  </div>
);

export default RecentActivity;