import React, { useEffect, useState } from "react";
import { Divider, Input, Button, notification, Menu, Tag } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import shortid from "shortid";
import { CopyToClipboard } from "react-copy-to-clipboard";

import * as env from "../env.js";
import Compiler from "./compiler.js";
import Submit from "./submit.js";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function DetailProblem({
  idProblemFromContest,
  idContest,
  setKeyMain,
  listProblems,
}) {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const openSuccessNotificationWithIcon = ({ message }) => {
    // console.log(type, api[type]);
    let placement = "bottomRight";
    api.success({
      message: message,
      placement,
    });
  };
  const openWarningNotificationWithIcon = ({ message }) => {
    // console.log(type, api[type]);
    let placement = "bottomRight";
    api.error({
      message: message,
      placement,
    });
  };

  const { idProblem } = useParams();

  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const hiddenTag = localStorage.getItem("hiddenTagProblem")
    ? JSON.parse(localStorage.getItem("hiddenTagProblem"))
    : null;

  const [problem, setProblem] = useState({});
  const fetchProblem = async () => {
    await setProblem({});
    await setTab("problem");
    axios
      .get(env.API_URL + "/problems", {})
      .then(async (response) => {
        if (idProblemFromContest) {
          let checkExist = await response.data.dataProblems.filter(
            (x) => x.idProblem === idProblemFromContest
          );
          if (checkExist.length > 0) {
            setProblem(checkExist[0]);
          }
        } else {
          let checkExist = await response.data.dataProblems.filter(
            (x) => x.idProblem === idProblem
          );
          if (checkExist.length > 0) {
            setProblem(checkExist[0]);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProblem();
  }, [idProblemFromContest]);

  const itemMenu = [
    {
      key: "problem",
      label: "Bài tập",
    },
    {
      key: "submit",
      label: "Gửi bài giải",
    },
    {
      key: "compiler",
      label: "Trình biên dịch",
    },
  ];
  const [tab, setTab] = useState("problem");
  const changeTab = (e) => {
    setTab(e.key);
  };
  const [code, setCode] = useState("");
  const [lang, setLang] = useState(54);
  const [nameLanguage, setNameLanguage] = useState("C++");

  const SubmitFile = () => {
    if (code === "") {
      openWarningNotificationWithIcon({
        message: "Vui lòng chọn file thích hợp",
      });
    } else {
      axios
        .post(env.API_URL + "/submission", {
          idSubmission: shortid.generate(),
          idProblem: problem.idProblem,
          idUser: user._id,
          idContest: idContest ? idContest : "none",
          source: code,
          detailTestCase: problem.testCase,
          maxTime: 0,
          maxMemory: 0,
          status: "Đang chờ",
          idLanguage: lang,
          language: nameLanguage,
          createTime: moment().format("DD/MM/YYYY HH:mm"),
          time: moment().format("YYYY-MM-DD"),
        })
        .then(function (response) {
          if (idProblemFromContest) {
            setKeyMain("MySubmissions");
          } else {
            navigate("/submissions");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <>
      {Object.keys(problem).length === 0 ? (
        <div className="flex justify-center">Không tìm thấy bài tập</div>
      ) : (
        <div className="pl-3">
          {contextHolder}
          <Menu
            mode="horizontal"
            items={itemMenu}
            defaultSelectedKeys={["problem"]}
            onClick={changeTab}
          />
          {tab === "problem" && (
            <div
              className="w-full flex mt-10"
              style={{
                fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",
              }}
            >
              <div className="w-3/4">
                <div className="justify-center items-center flex flex-col">
                  <div className="text-3xl mb-3">{problem.nameProblem}</div>
                  <div className="text-xl">
                    <span className="font-bold">Giới hạn thời gian:</span>{" "}
                    {problem.timeLimit} giây
                  </div>
                  <div className="text-xl">
                    <span className="font-bold">Giới hạn bộ nhớ:</span>{" "}
                    {problem.memoryLimit}MB
                  </div>
                </div>
                <Divider />
                <div
                  dangerouslySetInnerHTML={{ __html: problem.contentProblem }}
                  className="mb-3"
                ></div>
                <Divider />
                {problem.example &&
                  problem.example.map((item, index) => (
                    <>
                      <div className="font-bold mb-3">Ví dụ {index + 1}</div>
                      <div className="font-bold">Đầu vào:</div>
                      <div className="relative">
                        <Input.TextArea
                          readOnly
                          autoSize
                          value={item.input}
                          className="mb-3 py-5"
                        ></Input.TextArea>
                        <CopyToClipboard text={item.input}>
                          <Button
                            icon={<CopyOutlined />}
                            type="dashed"
                            className="absolute top-0 right-0"
                            onClick={() =>
                              openSuccessNotificationWithIcon({
                                message: "Đã copy",
                              })
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
                          value={item.output}
                          className="mb-3 py-5"
                        ></Input.TextArea>
                        <CopyToClipboard text={item.output}>
                          <Button
                            icon={<CopyOutlined />}
                            type="dashed"
                            className="absolute top-0 right-0"
                            onClick={() =>
                              openSuccessNotificationWithIcon({
                                message: "Đã copy",
                              })
                            }
                          >
                            Copy
                          </Button>
                        </CopyToClipboard>
                      </div>
                    </>
                  ))}
                {problem.description && (
                  <>
                    <div className="font-bold mb-3">Giải thích:</div>
                    <div
                      dangerouslySetInnerHTML={{ __html: problem.description }}
                      className="mb-3"
                    ></div>
                  </>
                )}
              </div>
              <div className="w-1/4 justify-end">
                <div className="flex flex-col justify-center items-center">
                  <div className="relative flex w-11/12 flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
                    <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100">
                      <h4 className="text-lg font-bold text-navy-700 mx-auto">
                        Nộp file
                      </h4>
                    </div>
                    <div className="w-full px-4 py-4 flex flex-col justify-center items-center text-base">
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            let fileName = e.target.files[0].name.split(".");
                            if (fileName[fileName.length - 1] === "cpp") {
                              setLang(54);
                              setNameLanguage("C++");
                            } else if (fileName[fileName.length - 1] === "c") {
                              setLang(50);
                              setNameLanguage("C");
                            } else if (
                              fileName[fileName.length - 1] === "java"
                            ) {
                              setLang(62);
                              setNameLanguage("Java");
                            } else if (fileName[fileName.length - 1] === "py") {
                              setLang(71);
                              setNameLanguage("Python");
                            } else if (fileName[fileName.length - 1] === "cs") {
                              setLang(51);
                              setNameLanguage("C#");
                            } else if (fileName[fileName.length - 1] === "js") {
                              setLang(63);
                              setNameLanguage("JavaScript");
                            } else {
                              setCode("");
                              openWarningNotificationWithIcon({
                                message: "File không hợp lệ",
                              });
                              return;
                            }
                            e.preventDefault();
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                              setCode(e.target.result);
                            };
                            reader.readAsText(e.target.files[0]);
                          }
                        }}
                      />
                      <Divider />
                      <Button type="dashed" onClick={SubmitFile}>
                        Nộp bài
                      </Button>
                    </div>
                  </div>
                  {!idProblemFromContest && (
                    <>
                      <div className="mt-5 relative flex w-11/12 flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
                        <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100">
                          <h4 className="text-lg font-bold text-navy-700">
                            Dạng bài tập
                          </h4>
                        </div>
                        <div className="w-full overflow-x-scroll px-4 py-4 md:overflow-x-hidden">
                          {hiddenTag ? (
                            <Tag color="cyan">Đã che</Tag>
                          ) : (
                            problem.tags &&
                            problem.tags.map((item, index) => (
                              <Tag color="cyan">{item}</Tag>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="mt-5 relative flex w-11/12 flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
                        <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100">
                          <h4 className="text-lg font-bold text-navy-700">
                            Độ khó
                          </h4>
                        </div>
                        <div className="w-full overflow-x-scroll px-4 py-4 md:overflow-x-hidden">
                          {hiddenTag ? (
                            <Tag color="cyan">Đã che</Tag>
                          ) : (
                            <Tag color="red">{problem.difficulty}</Tag>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {tab === "compiler" && <Compiler />}
          {tab === "submit" && (
            <Submit
              idProblemFromContest={
                idProblemFromContest ? idProblemFromContest : null
              }
              idContest={idContest ? idContest : null}
              setKeyMain={setKeyMain}
            />
          )}
        </div>
      )}
    </>
  );
}
