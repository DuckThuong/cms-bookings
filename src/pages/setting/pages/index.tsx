import { useState } from "react";
import { SettingSideBar } from "../components/SettingSideBar";
import { Settings } from "./Page1";
import "./style.scss";
import { PaymentSettingPage } from "./Page2";
export const SettingPage = () => {
    const [activeKey, setActiveKey] = useState<string>('setting');
    return (
        <div className="setting_page mgmt-page">
            <div className="mgmt-hero">
                <div className="mgmt-hero__eyebrow">Quản lý cài đặt</div>
                <div className="mgmt-hero__title">Cài đặt hệ thống và thông tin chuyển khoản</div>
                <div className="mgmt-hero__subtitle">Quản lý các cài đặt liên quan đến hệ thống và thông tin chuyển khoản</div>
            </div>
            <div className="setting_wrapper">
                <SettingSideBar key={activeKey} onChange={setActiveKey} />
                <div className="setting_wrapper-main">
                    {activeKey === 'setting' && <div className="mgmt-main__content"><Settings /></div>}
                    {activeKey === 'payment' && <div className="mgmt-main__content"><PaymentSettingPage /></div>}
                </div>
            </div>
        </div>
    )
}