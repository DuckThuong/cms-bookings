import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebRouter } from "./Router";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

const RouterWeb = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<WebRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterWeb;
