import React, { useEffect, useState } from "react";
import { Layout, theme, Menu } from "antd";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import moment from "moment";

const { Content } = Layout;

export default function Courses({ currentTab }) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const [items, setItems] = useState([]);
  const fetchDataPlaylistYoutube = async () => {
    const channelId = "UCyPlQUSLH4NzrxruIjEBsug";
    const part = "snippet";
    const key = "AIzaSyBIbycqky8fGBC6JP_cvOB_E19gatIJrPw";
    await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=${part}&maxResults=50&channelId=${channelId}&key=${key}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        let item = [];
        await data.items.forEach(async (element, index) => {
          await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=${part}&playlistId=${element.id}&key=${key}`
          )
            .then((response) => response.json())
            .then((data) => {
              item.push(
                getItem(
                  element.snippet.title,
                  element.id,
                  null,
                  data.items.map((element) => {
                    return getItem(
                      element.snippet.title,
                      element.snippet.resourceId.videoId
                    );
                  })
                )
              );
            });
          if (item.length === data.items.length) {
            setItems(item);
          }
        });
      });
  };
  useEffect(() => {
    fetchDataPlaylistYoutube();
  }, []);

  const [key, setKey] = useState("");
  const onClick = (e) => {
    setKey(e.key);
  };

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
          <div className="flex w-full">
            <div className="w-1/4">
              <Menu mode="inline" items={items} onClick={onClick} />
            </div>
            <div className="w-3/4 h-screen">
              {key !== "" && (
                <iframe
                  src={`https://www.youtube.com/embed/${key}`}
                  className="w-full h-2/3"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
