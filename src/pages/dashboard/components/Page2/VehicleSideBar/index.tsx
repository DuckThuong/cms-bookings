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
        {vehicles.map((vehicle) => (
          <Tooltip
            key={vehicle.id}
            title={vehicle.status === 'maintenance' ? 'Đang bảo dưỡng' : ''}
            placement="right"
          >
            <div
              className={[
                'vehicle-item',
                selected === vehicle.id ? 'vehicle-item--active' : '',
                vehicle.status === 'maintenance' ? 'vehicle-item--maintenance' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(vehicle.id)}
            >
              <div className="vehicle-item__icon">{vehicle.icon}</div>

              <div className="vehicle-item__body">
                <div className="vehicle-item__label">{vehicle.label}</div>
                {vehicle.type && <div className="vehicle-item__type">{vehicle.type}</div>}
                {vehicle.status === 'maintenance' && (
                  <div className="vehicle-item__maintenance">Bảo dưỡng</div>
                )}
              </div>

              <div className="vehicle-item__badge">{vehicle.count}</div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default VehicleSidebar;
