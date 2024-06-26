import React, { useEffect, useState } from "react";
import { Table, Modal, Button, notification, Input } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { CopyToClipboard } from "react-copy-to-clipboard";

import * as env from "../env.js";

import { Link } from "react-router-dom";
import axios from "axios";

export default function SubmissionTable({ idContest, idUser }) {
  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
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
                    if (idContest) {
                      if (
                        element.idUser === idUser &&
                        element.idContest === idContest
                      ) {
                        arr.push({
                          idSubmission: element.idSubmission,
                          createTime: element.createTime,
                          username: responseAccount.data.dataAccounts.filter(
                            (x) => x._id === element.idUser
                          )[0].username,
                          rating: responseAccount.data.dataAccounts.filter(
                            (x) => x._id === element.idUser
                          )[0].rating,
                          idProblem: element.idProblem,
                          problem:
                            await responseProblem.data.dataProblems.filter(
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
                    } else {
                      arr.push({
                        idUser: element.idUser,
                        idSubmission: element.idSubmission,
                        createTime: element.createTime,
                        username: responseAccount.data.dataAccounts.filter(
                          (x) => x._id === element.idUser
                        )[0].username,
                        rating: responseAccount.data.dataAccounts.filter(
                          (x) => x._id === element.idUser
                        )[0].rating,
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
    fetchDataSubmissions();
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
      render: (username, item) => {
        return (
          <>
            {item.rating < 1200 ? (
              <a
                className="text-stone-400 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 1400 ? (
              <a
                className="text-green-500 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 1600 ? (
              <a
                className="text-cyan-300 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 1900 ? (
              <a
                className="text-blue-600 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 2100 ? (
              <a
                className="text-purple-500 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 2400 ? (
              <a
                className="text-amber-500 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : item.rating < 2600 ? (
              <a
                className="text-pink-600 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            ) : (
              <a
                className="text-red-600 font-bold"
                href={"/profile/".concat(item.idUser)}
              >
                {username.split("@")[0]}
              </a>
            )}
          </>
        );
      },
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
    <>
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
                <div className="mb-3">
                  <span className="font-bold">Thời gian:</span>{" "}
                  {Number(item.time) * 1000} ms,{" "}
                  <span className="font-bold">Bộ nhớ:</span> {item.memory} KB
                </div>
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
      <Table columns={columns} dataSource={dataSubmisions} />
    </>
  );
}
