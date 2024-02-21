import React from "react";
import { Layout, theme } from "antd";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import Problem from "../components/detailProblem.js";

const { Content } = Layout;

export default function DetailProblem({ currentTab }) {
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
          <Problem />
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
