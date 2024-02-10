import React from "react";
import { Layout, theme } from "antd";

// import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";

const { Content } = Layout;

export default function Contest({ currentTab }) {
  //   const user = localStorage.getItem("dataUser")
  //     ? JSON.parse(localStorage.getItem("dataUser"))
  //     : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <HeaderPage currentTab={currentTab} />
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: "20px",
          }}
          className="min-h-screen"
        >
          <div className="w-full flex mt-10">
            <div className="w-3/4">
              
            </div>
            <div className="w-1/4 justify-end"></div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
