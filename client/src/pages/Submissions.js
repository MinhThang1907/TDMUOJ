import React, { useEffect, useState } from "react";
import { Layout, Table, theme, Modal, Button, notification, Input } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { CopyToClipboard } from "react-copy-to-clipboard";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
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
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    // console.log(type, api[type]);
    let placement = "bottomRight";
    api.success({
      message: "Đã copy",
      placement,
    });
  };

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
                      colorStatus: element.status.includes("Wrong")
                        ? "rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                        : element.status.includes("Time") ||
                          element.status.includes("chờ")
                        ? "rounded bg-gray-500 px-3 py-1 text-xs font-semibold text-white"
                        : element.status.includes("Accepted")
                        ? "rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white"
                        : "rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white",
                      detailTestCase: element.detailTestCase,
                      numberOfAcceptedTestCase:
                        element.numberOfAcceptedTestCase,
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

  const [detailTestCase, setDetailTestCase] = useState([]);
  const [detailStatus, setDetailStatus] = useState("");
  const [detailColorStatus, setDetailColorStatus] = useState("");
  const [detailNameProblem, setDetailNameProblem] = useState("");

  const [isModalDetailTestCase, setIsModalDetailTestCase] = useState(false);
  const showModalDetailTestCase = () => {
    setIsModalDetailTestCase(true);
  };
  const handleCancelModalDetailTestCase = () => {
    setIsModalDetailTestCase(false);
  };

  const columns = [
    {
      title: "Chi tiết",
      dataIndex: "idSubmission",
      key: "idSubmission",
      width: "10%",
      align: "center",
      render: (_, item) => (
        <Link
          onClick={() => {
            setDetailTestCase(
              item.detailTestCase.filter(function (element, index) {
                return index <= item.numberOfAcceptedTestCase;
              })
            );
            setDetailStatus(item.status);
            setDetailNameProblem(item.problem);
            setDetailColorStatus(
              item.status.includes("Wrong")
                ? "rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                : item.status.includes("Time") || item.status.includes("chờ")
                ? "rounded bg-gray-500 px-3 py-1 text-xs font-semibold text-white"
                : item.status.includes("Accepted")
                ? "rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white"
                : "rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white"
            );
            showModalDetailTestCase();
          }}
        >
          {item.idSubmission}
        </Link>
      ),
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
      {contextHolder}
      <Modal
        closeIcon={null}
        open={isModalDetailTestCase}
        onCancel={handleCancelModalDetailTestCase}
        footer={null}
        className="justify-center w-[800px] flex"
      >
        <div className="uppercase tracking-wide text-smfont-semibold">
          <div>
            <strong>Tên bài tập:</strong> {detailNameProblem}
          </div>
          <div>
            <strong>Trạng thái:</strong>{" "}
            <span className={detailColorStatus}>{detailStatus}</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-[800px] mx-auto bg-gray-200 rounded-xl shadow-md overflow-hidden m-5">
            <pre className="p-4">
              {detailTestCase.length > 0 && detailTestCase[0].source_code}
            </pre>
          </div>
          <CopyToClipboard
            text={detailTestCase.length > 0 && detailTestCase[0].source_code}
          >
            <Button
              icon={<CopyOutlined />}
              type="dashed"
              className="absolute top-0 right-0"
              onClick={() => openNotificationWithIcon("success")}
            >
              Copy
            </Button>
          </CopyToClipboard>
        </div>
        {detailTestCase.length > 0 &&
          detailTestCase.map((item, index) => (
            <div className="w-[800px] mx-auto bg-white rounded-xl shadow-md overflow-hidden m-5">
              <div className="p-4">
                <div className="font-bold mb-3">TEST CASE {index + 1}</div>
                <div className="font-bold">Đầu vào:</div>
                <div className="relative">
                  <Input.TextArea
                    readOnly
                    autoSize
                    value={item.stdin}
                    className="mb-3 py-5"
                  ></Input.TextArea>
                  <CopyToClipboard text={item.input}>
                    <Button
                      icon={<CopyOutlined />}
                      type="dashed"
                      className="absolute top-0 right-0"
                      onClick={() =>
                        openNotificationWithIcon("success", "bottomRight")
                      }
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
                <div className="font-bold">Đầu ra:</div>
                <div className="relative">
                  <Input.TextArea
                    readOnly
                    autoSize
                    value={item.stdout}
                    className="mb-3 py-5"
                  ></Input.TextArea>
                  <CopyToClipboard text={item.output}>
                    <Button
                      icon={<CopyOutlined />}
                      type="dashed"
                      className="absolute top-0 right-0"
                      onClick={() => openNotificationWithIcon("success")}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
                <div className="font-bold">Đáp án:</div>
                <div className="relative">
                  <Input.TextArea
                    readOnly
                    autoSize
                    value={item.expected_output}
                    className="mb-3 py-5"
                  ></Input.TextArea>
                  <CopyToClipboard text={item.expected_output}>
                    <Button
                      icon={<CopyOutlined />}
                      type="dashed"
                      className="absolute top-0 right-0"
                      onClick={() => openNotificationWithIcon("success")}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          ))}
      </Modal>
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
