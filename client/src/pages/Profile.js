import React, { useEffect, useState } from "react";
import { Image, Layout, theme, Menu } from "antd";
import {
  IdcardOutlined,
  RobotOutlined,
  SolutionOutlined,
  ProjectOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import InfoProfile from "../components/infoProfile.js";
import EditProfile from "../components/editProfile.js";
import RequestNews from "../components/requestNews.js";
import ChatBox from "../components/chatBox.js";
import { useParams } from "react-router-dom";

const { Content } = Layout;

export default function Profile() {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { idUser } = useParams();

  const [profile, setProfile] = useState({});

  const fetchProfile = () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(async (responseAccount) => {
        let checkExist = await responseAccount.data.dataAccounts.filter(
          (x) => x._id === idUser
        )[0];
        console.log("kkkk", checkExist);
        setProfile(checkExist);
        axios
          .get(env.API_URL + "/submission", {})
          .then(async (responseSubmission) => {
            let dates = [];
            let submissions =
              await responseSubmission.data.dataSubmissions.filter(
                (x) => x.idUser === checkExist._id && x.status === "Accepted"
              );
            await submissions.forEach((element) => {
              dates.push({
                date: element.time,
                value: submissions.filter((x) => x.time === element.time)
                  .length,
              });
            });
            setData(dates);
            axios
              .get(env.API_URL + "/problems", {})
              .then(async (responseProblem) => {
                let numAccepted =
                  await responseProblem.data.dataProblems.filter((x) =>
                    x.solved.includes(checkExist._id)
                  ).length;
                setNumberOfAccepted(numAccepted);
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFollow = () => {
    axios
      .put(env.API_URL + "/update-followers", {
        id: idUser,
        followers: [...profile.followers, user._id],
      })
      .then(function (response) {
        fetchProfile();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleUnFollow = () => {
    axios
      .put(env.API_URL + "/update-followers", {
        id: idUser,
        followers: profile.followers.filter((x) => x !== user._id),
      })
      .then(function (response) {
        fetchProfile();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [numberOfAccepted, setNumberOfAccepted] = useState(0);

  useEffect(() => {
    fetchProfile();
    if (idUser === user._id) {
      setItems([
        ...items,
        getItem(
          <span className="uppercase font-medium text-base">
            Sửa thông tin
          </span>,
          "editInfo",
          <EditOutlined style={{ fontSize: 20 }} />
        ),
        getItem(
          <span className="uppercase font-medium text-base">
            Yêu cầu tin tức
          </span>,
          "requestNews",
          <RobotOutlined style={{ fontSize: 20 }} />
        ),
      ]);
    }
  }, []);

  const [key, setKey] = useState("info");

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const [items, setItems] = useState([
    getItem(
      <span className="uppercase font-medium text-base">Thông tin</span>,
      "info",
      <IdcardOutlined style={{ fontSize: 20 }} />
    ),
  ]);

  const onClick = (e) => {
    setKey(e.key);
  };

  const [data, setData] = useState([]);

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
          <div className="container mx-auto">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
              <div className="col-span-4 sm:col-span-3">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <Image
                      alt=""
                      src={profile.avatar}
                      className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                    ></Image>
                    <h1 className="text-xl font-bold">
                      {profile.maxRating < 1200 ? (
                        <span className="text-stone-400">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 1400 ? (
                        <span className="text-green-500">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 1600 ? (
                        <span className="text-cyan-300">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 1900 ? (
                        <span className="text-blue-600">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 2100 ? (
                        <span className="text-purple-500">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 2400 ? (
                        <span className="text-amber-500">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : profile.maxRating < 2600 ? (
                        <span className="text-pink-600">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          {profile.name !== ""
                            ? profile.name
                            : profile.username}
                        </span>
                      )}
                    </h1>
                    {idUser !== user._id && (
                      <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {!profile?.followers?.find((x) => x === user._id) ? (
                          <div
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
                            onClick={handleFollow}
                          >
                            Theo dõi
                          </div>
                        ) : (
                          <div
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded cursor-pointer"
                            onClick={handleUnFollow}
                          >
                            Bỏ theo dõi
                          </div>
                        )}
                        <div
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded cursor-pointer"
                          onClick={() => setKey("chat")}
                        >
                          Trò chuyện
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="my-6 border-t border-gray-300" />
                  <div className="flex flex-col">
                    <Menu
                      mode="inline"
                      items={items}
                      onClick={onClick}
                      defaultSelectedKeys={["info"]}
                    />
                  </div>
                </div>
              </div>
              {key === "info" && (
                <InfoProfile
                  profile={profile}
                  numberOfAccepted={numberOfAccepted}
                  data={data}
                />
              )}
              {key === "editInfo" && (
                <EditProfile fetchProfile={fetchProfile} />
              )}
              {key === "requestNews" && <RequestNews />}
              {key === "chat" && <ChatBox />}
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
