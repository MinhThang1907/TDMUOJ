import React from "react";
import { Layout, theme } from "antd";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";

import FooterPage from "../components/footer";
import HeaderPage from "../components/header";

const { Content } = Layout;
const images = [
  "/Images/OLPHueCity.jpg",
  "/Images/OLPTruongLan9.jpg",
  "/Images/TongKetCLBIT.jpg",
  "/Images/UCPC.jpg",
];

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
            minHeight: 600,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: "20px",
          }}
        >
          <Slide autoplay={true}>
            {images.map((element, index) => (
              <div className="each-slide-effect">
                <div
                  style={{
                    backgroundImage: `url(${element})`,
                    height: 350,
                    backgroundSize: "contain",
                  }}
                ></div>
              </div>
            ))}
          </Slide>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
};
export default Home;
