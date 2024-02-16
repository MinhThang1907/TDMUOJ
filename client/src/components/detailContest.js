import React from "react";
import { Layout, theme } from "antd";

import * as env from "../env.js";

import HeaderPage from "./header.js";
import FooterPage from "./footer.js";
import { useParams } from "react-router-dom";

const { Content } = Layout;

export default function DetailContest() {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { idContest } = useParams();
  return (
    <Layout>
      <HeaderPage />
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
          <button onClick={() => console.log(idContest)}>dwidw</button>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
