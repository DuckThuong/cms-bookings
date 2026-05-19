import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { WelcomePage } from "../pages/auth/pages/WelcomePage";
import { Login } from "@/pages/auth/pages/Login";
import { SignIn } from "@/pages/auth/pages/SignIn";
import { OtpConfirm } from "@/pages/auth/pages/OtpConfirm";
import { Finish } from "@/pages/auth/pages/Finish";
import { HomePage } from "@/pages/home/pages/Page1";
import { TripPage } from "@/pages/home/pages/Page2";
import { PromosPage } from "@/pages/home/pages/Page3";
import { SupportPage } from "@/pages/home/pages/Page4";
import { ProfilePage } from "@/pages/profile/pages";
import { SeatSelectionPage } from "@/pages/booking/pages/Page1";
import { BookingInfoRoute } from "@/pages/booking/pages/Page2";
import { BookingConfirmRoute } from "@/pages/booking/pages/Page3";
import BookingSuccessRoute, {
  BookingSuccessPage,
} from "@/pages/booking/pages/Page4";
import { NotificationsPage } from "@/pages/notification";

export const WebRouter = () => (
  <Routes>
    {/* auth */}
    <Route path={ROUTER_PATH.WELCOME} element={<WelcomePage />} />
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.SIGNIN} element={<SignIn />} />
    <Route path={ROUTER_PATH.OTP_CONFIRM} element={<OtpConfirm />} />
    <Route path={ROUTER_PATH.FINISH} element={<Finish />} />
    {/* home */}
    <Route path={ROUTER_PATH.HOME} element={<HomePage />} />
    <Route path={ROUTER_PATH.TRIP} element={<TripPage />} />
    <Route path={ROUTER_PATH.BOOKING} element={<SeatSelectionPage />} />
    <Route path={ROUTER_PATH.BOOKING_INFO} element={<BookingInfoRoute />} />
    <Route
      path={ROUTER_PATH.BOOKING_CONFIRM}
      element={<BookingConfirmRoute />}
    />
    <Route
      path={ROUTER_PATH.BOOKING_SUCCESS}
      element={<BookingSuccessRoute />}
    />
    <Route path={ROUTER_PATH.PROMOS} element={<PromosPage />} />
    <Route path={ROUTER_PATH.SUPPORT} element={<SupportPage />} />
    <Route path={ROUTER_PATH.PROFILE} element={<ProfilePage />} />
    <Route path={ROUTER_PATH.NOTIFICATION} element={<NotificationsPage />} />
  </Routes>
);
