import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

const FooterPage = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      TDMUOJ © {new Date().getFullYear()} phát triển bởi Câu lạc bộ IT TDMU
    </Footer>
  );
};

export default FooterPage;
