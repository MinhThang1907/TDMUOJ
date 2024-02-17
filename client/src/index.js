import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
