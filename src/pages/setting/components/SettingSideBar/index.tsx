import { CreditCardOutlined, SettingOutlined } from "@ant-design/icons";

interface VehicleSidebarProps {
    key: string;
    onChange: (id: string) => void;
}
interface ISettingSideBarItem {
    key: string;
    label: string;
    icon: React.ReactNode;

}

const SettingSideBarItem: ISettingSideBarItem[] = [
    {
        key: 'setting',
        label: 'Cài đặt',
        icon: <SettingOutlined />
    },
    {
        key: 'payment',
        label: 'Thông tin chuyển khoản',
        icon: <CreditCardOutlined />
    }

]

export const SettingSideBar = ({ key, onChange }: VehicleSidebarProps) => {
    return (
        <div className="bm-vehicle-sidebar">
            <div className="bm-vehicle-sidebar__header">
                <div className="title">Thông tin cài đặt</div>
            </div>
            <div className="bm-vehicle-sidebar__list">
                {SettingSideBarItem.map((item) => (
                    <div
                        key={item.key}
                        className={[
                            "vehicle-item",
                            key === item.key ? "vehicle-item--active" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        onClick={() => onChange(item.key)}
                    >
                        <div className="vehicle-item__icon" style={{ width: '24px', height: '24px' }}>{item.icon}</div>
                        <div className="vehicle-item__body">
                            <div className="vehicle-item__label">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
