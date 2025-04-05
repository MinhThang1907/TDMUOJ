import React, { useEffect, useState } from "react";
import { Layout, theme, Tabs, Menu, Divider, Tag, Table, Modal } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import Problem from "../components/detailProblem.js";
import ContestRanking from "../components/contestRanking.js";
import SubmissionTable from "../components/submissionsTable.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const { Content } = Layout;

export default function DetailContest() {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [modal, warningLeave] = Modal.useModal();
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const { idContest } = useParams();
  const [keyMain, setKeyMain] = useState("problems");
  const [contest, setContest] = useState({});
  const [listProblems, setListProblems] = useState([]);
  const [idProblem, setIdProblem] = useState("");
  const [remainTime, setRemainTime] = useState("");
  const [remain, setRemain] = useState(moment());
  const [current, setCurrent] = useState(moment());
  const [status, setStatus] = useState("");

  const [problems, setProblems] = useState([]);

  const itemsMain = [
    {
      key: "problems",
      label: "Các vấn đề",
    },
    {
      key: "ranking",
      label: "Bảng xếp hạng",
    },
    {
      key: "MySubmissions",
      label: "Bài nộp của tôi",
    },
  ];
  const columns = [
    {
      title: "Tên cuộc thi",
      dataIndex: "nameContest",
      key: "nameContest",
      width: "30%",
      align: "center",
    },
    {
      title: "Người viết đề",
      dataIndex: "writer",
      key: "writer",
      width: "40%",
      align: "center",
      render: (_, { writer }) => (
        <>
          {writer &&
            writer.map((writer) => {
              return <Tag color="purple">{writer}</Tag>;
            })}
        </>
      ),
    },
    {
      title: "Bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      width: "15%",
      align: "center",
    },
    {
      title: "Thời gian",
      dataIndex: "lengthTime",
      key: "lengthTime",
      align: "center",
      render: (_, { lengthTime }) => (
        <>
          {parseInt(lengthTime / 1440) !== 0 && (
            <span>
              {parseInt(parseInt(lengthTime / 1440) / 10) !== 0
                ? parseInt(lengthTime / 1440)
                : "0".concat(parseInt(lengthTime / 1440))}
              :
            </span>
          )}
          <span>
            {parseInt(parseInt((lengthTime % 1440) / 60) / 10) !== 0
              ? parseInt((lengthTime % 1440) / 60)
              : "0".concat(parseInt((lengthTime % 1440) / 60))}
            :
            {parseInt(parseInt((lengthTime % 1440) % 60) / 10) !== 0
              ? parseInt((lengthTime % 1440) % 60)
              : "0".concat(parseInt((lengthTime % 1440) % 60))}
          </span>
        </>
      ),
    },
  ];
  let myInterval;
  useEffect(() => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(async function (responseProblem) {
        let problems = await responseProblem.data.dataProblems;
        axios
          .get(env.API_URL + "/contest", {})
          .then(async (response) => {
            let idVirtualContest = localStorage.getItem("idVirtualContest")
              ? JSON.parse(localStorage.getItem("idVirtualContest"))
              : null;
            let contest;
            if (idVirtualContest?.idContestVirtual === idContest) {
              contest = await response.data.dataContests.find(
                (x) => x.idContest === idVirtualContest.idContestVirtual
              );
            } else {
              contest = await response.data.dataContests.find(
                (x) => x.idContest === idContest
              );
            }
            setContest(contest);
            if (
              moment(contest.timeStart, "DD/MM/YYYY HH:mm").isSameOrBefore(
                moment()
              ) &&
              moment(contest.timeStart, "DD/MM/YYYY HH:mm")
                .add(contest.lengthTime, "minutes")
                .isSameOrAfter(moment())
            ) {
              setStatus("running");
              myInterval = setInterval(
                () =>
                  countDownTime({
                    timeStart: contest.timeStart,
                    lengthTime: contest.lengthTime,
                  }),
                1000
              );
              setListProblems(
                new Array(contest.problems.length)
                  .fill(null)
                  .map((item, index) => {
                    return getItem(
                      <span className="font-medium text-base">
                        {String.fromCharCode(index + 65)
                          .concat(" - ")
                          .concat(contest.problems[index].nameProblem)}{" "}
                        {problems
                          .find(
                            (x) =>
                              x.idProblem === contest.problems[index].idProblem
                          )
                          ?.solved.find((x) => x === user?._id) && (
                          <CheckCircleFilled className="text-green-500" />
                        )}
                      </span>,
                      contest.problems[index].idProblem
                    );
                  })
              );
            } else if (
              moment(contest.timeStart, "DD/MM/YYYY HH:mm").isAfter(moment())
            ) {
              setStatus("pending");
              myInterval = setInterval(async () => {
                setCurrent(moment());
                setRemain(moment(contest.timeStart, "DD/MM/YYYY HH:mm"));
                if (
                  moment().isSameOrAfter(
                    moment(contest.timeStart, "DD/MM/YYYY HH:mm")
                  )
                ) {
                  window.location.reload();
                }
              }, 1000);
            } else {
              setStatus("finished");
              setListProblems(
                new Array(contest.problems.length)
                  .fill(null)
                  .map((item, index) => {
                    return getItem(
                      <span className="font-medium text-base">
                        {String.fromCharCode(index + 65)
                          .concat(" - ")
                          .concat(contest.problems[index].nameProblem)}{" "}
                        {problems
                          .find(
                            (x) =>
                              x.idProblem === contest.problems[index].idProblem
                          )
                          ?.solved.find((x) => x === user?._id) && (
                          <CheckCircleFilled className="text-green-500" />
                        )}
                      </span>,
                      contest.problems[index].idProblem
                    );
                  })
              );
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const countDownTime = ({ timeStart, lengthTime }) => {
    let timeEnd = moment(timeStart, "DD/MM/YYYY HH:mm").add(
      lengthTime,
      "minutes"
    );
    let current = moment();
    if (current.isSameOrAfter(timeEnd)) {
      setStatus("finished");
      clearInterval(myInterval);
      let virtualContest = localStorage.getItem("idVirtualContest")
        ? JSON.parse(localStorage.getItem("idVirtualContest"))
        : null;
      if (virtualContest?.idContestVirtual === idContest) {
        axios
          .put(env.API_URL + "/delete-contest", {
            id: idContest,
          })
          .then(function (response) {
            axios
              .put(env.API_URL + "/delete-ranking-contest", {
                id: idContest,
              })
              .then(function (response) {
                localStorage.removeItem("idVirtualContest");
                navigate("/contest");
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      return;
    }
    if (timeEnd.diff(current, "days") !== 0) {
      setRemainTime(
        timeEnd
          .diff(current, "days")
          .toString()
          .concat(" ngày ")
          .concat(
            parseInt(
              parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600) / 10
            ) !== 0
              ? parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600)
                  .toString()
                  .concat(":")
              : "0"
                  .concat(
                    parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600)
                  )
                  .concat(":")
          )
          .concat(
            parseInt(
              parseInt(
                ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
              ) / 10
            ) !== 0
              ? parseInt(
                  ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                )
                  .toString()
                  .concat(":")
              : "0"
                  .concat(
                    parseInt(
                      ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                    )
                  )
                  .concat(":")
          )
          .concat(
            parseInt(
              parseInt(
                ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
              ) / 10
            ) !== 0
              ? parseInt(
                  ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                ).toString()
              : "0".concat(
                  parseInt(
                    ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                  )
                )
          )
      );
    } else {
      setRemainTime(
        ""
          .concat(
            parseInt(
              parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600) / 10
            ) !== 0
              ? parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600)
                  .toString()
                  .concat(":")
              : "0"
                  .concat(
                    parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600)
                  )
                  .concat(":")
          )
          .concat(
            parseInt(
              parseInt(
                ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
              ) / 10
            ) !== 0
              ? parseInt(
                  ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                )
                  .toString()
                  .concat(":")
              : "0"
                  .concat(
                    parseInt(
                      ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                    )
                  )
                  .concat(":")
          )
          .concat(
            parseInt(
              parseInt(
                ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
              ) / 10
            ) !== 0
              ? parseInt(
                  ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                ).toString()
              : "0".concat(
                  parseInt(
                    ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                  )
                )
          )
      );
    }
  };

  const leaveVirtualContest = () => {
    let virtualContest = localStorage.getItem("idVirtualContest")
      ? JSON.parse(localStorage.getItem("idVirtualContest"))
      : null;
    axios
      .put(env.API_URL + "/delete-contest", {
        id: virtualContest.idContestVirtual,
      })
      .then(function (response) {
        axios
          .put(env.API_URL + "/delete-ranking-contest", {
            id: virtualContest.idContestVirtual,
          })
          .then(function (response) {
            localStorage.removeItem("idVirtualContest");
            navigate("/contest");
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const warningLeaveVirtualContest = () => {
    modal.confirm({
      title: "CẢNH BÁO",
      icon: <ExclamationCircleOutlined />,
      content:
        "Nếu bạn rời khỏi kỳ thi, bạn sẽ không thể tham gia lại. Bạn có chắc chắn muốn rời khỏi kỳ thi?",
      okText: "Tôi hiểu",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        leaveVirtualContest();
      },
    });
  };

  return (
    <Layout>
      {warningLeave}
      <HeaderPage currentTab="contest" />
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
          {(status === "running" || status === "finished") && (
            <>
              <Tabs
                type="card"
                items={itemsMain}
                onChange={(e) => setKeyMain(e)}
                activeKey={keyMain}
              />
              {keyMain === "problems" && (
                <div className="w-full flex">
                  <div className="w-1/4 flex flex-col items-center">
                    <Menu
                      mode="inline"
                      items={listProblems}
                      onClick={(e) => setIdProblem(e.key)}
                      disabled={
                        (localStorage.getItem("idVirtualContest")
                          ? JSON.parse(localStorage.getItem("idVirtualContest"))
                          : null
                        )?.idContestVirtual === idContest
                          ? false
                          : status === "finished" ||
                            !contest.participants.find((x) => x.idUser === user?._id)
                      }
                    />
                    <Divider />
                    <div className="text-2xl font-bold">
                      {contest.nameContest}
                    </div>
                    <div className="font-normal text-xl flex flex-col">
                      <div>
                        Thời gian làm bài:{" "}
                        {parseInt(contest.lengthTime / 1440) !== 0 && (
                          <span>
                            {parseInt(
                              parseInt(contest.lengthTime / 1440) / 10
                            ) !== 0
                              ? parseInt(contest.lengthTime / 1440)
                              : "0".concat(
                                  parseInt(contest.lengthTime / 1440)
                                )}{" "}
                            ngày{" "}
                          </span>
                        )}
                        <span>
                          {parseInt(
                            parseInt((contest.lengthTime % 1440) / 60) / 10
                          ) !== 0
                            ? parseInt((contest.lengthTime % 1440) / 60)
                            : "0".concat(
                                parseInt((contest.lengthTime % 1440) / 60)
                              )}{" "}
                          giờ{" "}
                          {parseInt(
                            parseInt((contest.lengthTime % 1440) % 60) / 10
                          ) !== 0
                            ? parseInt((contest.lengthTime % 1440) % 60)
                            : "0".concat(
                                parseInt((contest.lengthTime % 1440) % 60)
                              )}{" "}
                          phút{" "}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl">
                      Còn lại:{" "}
                      {status === "running" && (
                        <span className="text-red-500 font-bold">
                          {remainTime}
                        </span>
                      )}
                      {status === "finished" && (
                        <span className="text-gray-500 font-bold">
                          Kỳ thi đã kết thúc
                        </span>
                      )}
                    </div>
                    {contest?.virtualMode && (
                      <div className="mt-5">
                        <button
                          class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                          onClick={warningLeaveVirtualContest}
                        >
                          Rời khỏi kỳ thi
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-3/4 justify-end">
                    {idProblem !== "" && (
                      <Problem
                        idProblemFromContest={idProblem}
                        idContest={contest.idContest}
                        setKeyMain={setKeyMain}
                        listProblems={listProblems}
                      />
                    )}
                  </div>
                </div>
              )}
              {keyMain === "ranking" && <ContestRanking />}
              {keyMain === "MySubmissions" && (
                <SubmissionTable idContest={idContest} idUser={user?._id} />
              )}
            </>
          )}
          {status === "pending" && (
            <>
              <div>
                <div className="text-center text-3xl font-bold">
                  {contest.nameContest}
                </div>
                <div className="text-center text-xl font-bold">
                  Cuộc thi sẽ bắt đầu sau
                </div>
                <div className="text-center text-2xl font-bold text-red-500">
                  {remain.diff(current, "days") !== 0 && (
                    <span>{remain.diff(current, "days")} ngày </span>
                  )}{" "}
                  {parseInt(
                    parseInt((remain.diff(current, "seconds") % 86400) / 3600) /
                      10
                  ) !== 0
                    ? parseInt((remain.diff(current, "seconds") % 86400) / 3600)
                    : "0".concat(
                        parseInt(
                          (remain.diff(current, "seconds") % 86400) / 3600
                        )
                      )}
                  :
                  {parseInt(
                    parseInt(
                      ((remain.diff(current, "seconds") % 86400) % 3600) / 60
                    ) / 10
                  ) !== 0
                    ? parseInt(
                        ((remain.diff(current, "seconds") % 86400) % 3600) / 60
                      )
                    : "0".concat(
                        parseInt(
                          ((remain.diff(current, "seconds") % 86400) % 3600) /
                            60
                        )
                      )}
                  :
                  {parseInt(
                    parseInt(
                      ((remain.diff(current, "seconds") % 86400) % 3600) % 60
                    ) / 10
                  ) !== 0
                    ? parseInt(
                        ((remain.diff(current, "seconds") % 86400) % 3600) % 60
                      )
                    : "0".concat(
                        parseInt(
                          ((remain.diff(current, "seconds") % 86400) % 3600) %
                            60
                        )
                      )}
                </div>
              </div>
              <Divider />
              <Table
                columns={columns}
                dataSource={[contest]}
                pagination={false}
              />
              <Divider />
              <div>
                <div dangerouslySetInnerHTML={{ __html: contest.rules }}></div>
              </div>
            </>
          )}
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
