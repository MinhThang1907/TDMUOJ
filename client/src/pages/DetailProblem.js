import React, { useEffect, useState } from "react";
import {
  Layout,
  theme,
  Divider,
  Input,
  Button,
  notification,
  Menu,
  Tag,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

import * as env from "../env.js";
import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import Compiler from "../components/compiler.js";
import { useNavigate, useParams } from "react-router-dom";

const { Content } = Layout;

export default function DetailProblem({ currentTab }) {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    // console.log(type, api[type]);
    let placement = "bottomRight";
    api.success({
      message: "Đã copy",
      placement,
    });
  };

  const { idProblem } = useParams();

  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
  const hiddenTag = localStorage.getItem("hiddenTagProblem")
    ? JSON.parse(localStorage.getItem("hiddenTagProblem"))
    : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [problem, setProblem] = useState({});
  const fetchProblem = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (response) {
        setProblem(
          response.data.dataProblems.filter((x) => x.idProblem === idProblem)[0]
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  const itemMenu = [
    {
      key: "problem",
      label: "Bài tập",
    },
    {
      key: "submission",
      label: "Danh sách bài nộp",
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

  return (
    <Layout>
      {contextHolder}
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
                          value={item.output}
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
                  <Button
                    type="primary"
                    ghost
                    className="w-1/2"
                    onClick={() =>
                      navigate("/submit/".concat(problem.idProblem))
                    }
                  >
                    Gửi bài giải
                  </Button>
                  <Divider />
                  <div className="relative flex w-11/12 flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
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
                </div>
              </div>
            </div>
          )}
          {tab === "compiler" && <Compiler />}
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
