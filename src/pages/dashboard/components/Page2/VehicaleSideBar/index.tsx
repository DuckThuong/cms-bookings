// components/booking/VehicleSidebar.jsx
import React from 'react';
import { Tooltip } from 'antd';
import { vehicles } from '../../../share/bookingManagement';

interface VehicleSidebarProps {
  selected: string;
  onChange: (id: string) => void;
}
const VehicleSidebar = ({ selected, onChange }: VehicleSidebarProps) => {
  return (
    <div className="bm-vehicle-sidebar">
      <div className="bm-vehicle-sidebar__header">
        <div className="title">Danh sách xe</div>
      </div>

      <div className="bm-vehicle-sidebar__list">
        {vehicles.map((v) => (
          <Tooltip
            key={v.id}
            title={v.status === 'maintenance' ? 'Đang bảo dưỡng' : ''}
            placement="right"
          >
            <div
              className={[
                'vehicle-item',
                selected === v.id ? 'vehicle-item--active' : '',
                v.status === 'maintenance' ? 'vehicle-item--maintenance' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(v.id)}
            >
              <div className="vehicle-item__icon">{v.icon}</div>

              <div className="vehicle-item__body">
                <div className="vehicle-item__label">{v.label}</div>
                {v.type && (
                  <div className="vehicle-item__type">{v.type}</div>
                )}
                {v.status === 'maintenance' && (
                  <div className="vehicle-item__maintenance">Bảo dưỡng</div>
                )}
              </div>

              <div className="vehicle-item__badge">{v.count}</div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default VehicleSidebar;