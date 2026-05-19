import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { WelcomePage } from "../pages/auth/pages/WelcomePage";
import { Login } from "@/pages/auth/pages/Login";
import { SignIn } from "@/pages/auth/pages/SignIn";

export const WebRouter = () => (
  <Routes>
    {/* auth */}
    <Route path={ROUTER_PATH.WELCOME} element={<WelcomePage />} />
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.SIGNIN} element={<SignIn />} />
  </Routes>
);
