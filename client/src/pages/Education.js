import React from "react";
import { Layout, theme, Tabs } from "antd";

// import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import PaintGraph from "../components/paintGraph.js";

const { Content } = Layout;

export default function Education({ currentTab }) {
  //   const user = localStorage.getItem("dataUser")
  //     ? JSON.parse(localStorage.getItem("dataUser"))
  //     : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "graph",
      label: "Đồ Thị",
      children: <PaintGraph />,
    },
  ];

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
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
