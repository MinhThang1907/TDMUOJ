import React, { useEffect, useState } from "react";
import { Layout, Table, theme } from "antd";

import * as env from "../env.js";

import HeaderPage from "./header.js";
import FooterPage from "./footer.js";
import { Link } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

export default function Submission({ currentTab }) {
  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [dataSubmisions, setDataSubmissions] = useState([]);

  const fetchDataSubmissions = () => {
    axios
      .get(env.API_URL + "/submission", {})
      .then((responseSubmission) => {
        axios
          .get(env.API_URL + "/account", {})
          .then((responseAccount) => {
            axios
              .get(env.API_URL + "/problems", {})
              .then(async (responseProblem) => {
                let arr = [];
                await responseSubmission.data.dataSubmissions.forEach(
                  async (element) => {
                    arr.push({
                      idSubmission: element.idSubmission,
                      createTime: element.createTime,
                      username: responseAccount.data.dataAccounts.filter(
                        (x) => x._id === element.idUser
                      )[0].username,
                      idProblem: element.idProblem,
                      problem: await responseProblem.data.dataProblems.filter(
                        (x) => x.idProblem === element.idProblem
                      )[0].nameProblem,
                      idLanguage:
                        element.language === "C++"
                          ? 54
                          : element.language === "C"
                          ? 50
                          : element.language === "C#"
                          ? 51
                          : element.language === "Python"
                          ? 71
                          : element.language === "Java"
                          ? 62
                          : element.language === "JavaScript"
                          ? 63
                          : 0,
                      language: element.language,
                      status: element.status,
                      maxTime: element.maxTime,
                      maxMemory: element.maxMemory,
                      colorStatus: element.status.includes("Sai")
                        ? "rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                        : element.status.includes("Time") || element.status.includes("chờ")
                        ? "rounded bg-gray-500 px-3 py-1 text-xs font-semibold text-white"
                        : element.status.includes("Accepted")
                        ? "rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white"
                        : "rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white",
                    });
                  }
                );
                setDataSubmissions(arr.reverse());
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

  useEffect(() => {
    const interval = setInterval(() => fetchDataSubmissions(), 1000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "idSubmission",
      key: "idSubmission",
      width: "10%",
      align: "center",
    },
    {
      title: "Đã nộp",
      dataIndex: "createTime",
      key: "createTime",
      width: "15%",
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      width: "13%",
      align: "center",
    },
    {
      title: "Bài tập",
      dataIndex: "problem",
      key: "problem",
      width: "20%",
      align: "center",
      render: (_, item) => (
        <Link to={"/problems/".concat(item.idProblem)}>{item.problem}</Link>
      ),
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      width: "10%",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
      render: (_, item) => (
        <span className={item.colorStatus}>{item.status}</span>
      ),
    },
    {
      title: "Thời gian (mili giây)",
      dataIndex: "maxTime",
      key: "maxTime",
      width: "7%",
      align: "center",
    },
    {
      title: "Bộ nhớ (kilobytes)",
      dataIndex: "maxMemory",
      key: "maxMemory",
      width: "10%",
      align: "center",
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
          <Table columns={columns} dataSource={dataSubmisions} />
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
