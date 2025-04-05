import { Layout, theme, Tabs } from "antd";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";

import FooterPage from "../components/footer";
import HeaderPage from "../components/header";
import News from "../components/news";
import TopUsers from "../components/topusers";

const { Content } = Layout;

// Slideshow images
const SLIDESHOW_IMAGES = [
  "/Images/OLPHueCity.jpg",
  "/Images/OLPTruongLan9.jpg",
  "/Images/TongKetCLBIT.jpg",
  "/Images/UCPC.jpg",
];

// Tab items
const TAB_ITEMS = [
  {
    key: "news",
    label: "Tin tức",
    children: <News />,
  },
];

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      <HeaderPage />

      <Content className="px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="p-4 sm:p-6 mt-5 min-h-screen"
        >
          {/* Slideshow - responsive height */}
          <div className="slideshow-container">
            <Slide autoplay={true}>
              {SLIDESHOW_IMAGES.map((image, index) => (
                <div key={index} className="each-slide-effect">
                  <div
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "contain",
                      // backgroundRepeat: "no-repeat",
                      // backgroundPosition: "center",
                      height: 350,
                    }}
                    className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]"
                  />
                </div>
              ))}
            </Slide>
          </div>

          {/* Main content - responsive layout */}
          <div className="w-full flex flex-col lg:flex-row mt-6 md:mt-8 lg:mt-10 gap-6">
            {/* News section - full width on mobile, 3/4 on desktop */}
            <div className="w-full lg:w-3/4">
              <Tabs type="card" items={TAB_ITEMS} />
            </div>

            {/* Top users section - full width on mobile, 1/4 on desktop */}
            <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
              <TopUsers />
            </div>
          </div>
        </div>
      </Content>

      <FooterPage />
    </Layout>
  );
};

export default Home;
