import { React, useState, useEffect } from "react";
import {
  Layout,
  theme,
  Table,
  Tabs,
  Divider,
  Button,
  Input,
  Calendar,
  Modal,
  message,
} from "antd";
import { CalendarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import shortid from "shortid";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

export default function Contest({ currentTab }) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const successMessage = () => {
    messageApi.open({
      type: "success",
      content: "Đăng ký thành công",
    });
  };

  const [contestsAreGoingOn, setContestsAreGoingOn] = useState([]);
  const [contestsInTheFuture, setContestsInTheFuture] = useState([]);
  const [contestsHavePassed, setContestsHavePassed] = useState([]);
  const [allContest, setAllContest] = useState([]);
  const fetchDataContests = () => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(async (responseContest) => {
        setAllContest(
          await responseContest.data.dataContests
            .sort(function (a, b) {
              if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return -1;
              } else if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isAfter(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return 1;
              } else {
                return 0;
              }
            })
            .filter((x) => x.virtualMode === false)
        );
        setContestsHavePassed(
          await responseContest.data.dataContests
            .filter(
              (x) =>
                moment().isAfter(
                  moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
                    x.lengthTime,
                    "minutes"
                  )
                ) && x.virtualMode === false
            )
            .sort(function (a, b) {
              if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return 1;
              } else if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isAfter(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return -1;
              } else {
                return 0;
              }
            })
        );
        setContestsInTheFuture(
          await responseContest.data.dataContests
            .filter(
              (x) =>
                moment().isBefore(moment(x.timeStart, "DD/MM/YYYY HH:mm")) &&
                x.virtualMode === false
            )
            .sort(function (a, b) {
              if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return -1;
              } else if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isAfter(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return 1;
              } else {
                return 0;
              }
            })
        );
        setContestsAreGoingOn(
          await responseContest.data.dataContests
            .filter(
              (x) =>
                moment().isSameOrAfter(
                  moment(x.timeStart, "DD/MM/YYYY HH:mm")
                ) &&
                moment().isSameOrBefore(
                  moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
                    x.lengthTime,
                    "minutes"
                  )
                ) &&
                x.virtualMode === false
            )
            .sort(function (a, b) {
              if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return -1;
              } else if (
                moment(a.timeStart, "DD/MM/YYYY HH:mm").isAfter(
                  moment(b.timeStart, "DD/MM/YYYY HH:mm")
                )
              ) {
                return 1;
              } else {
                return 0;
              }
            })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fixUI = async () => {
    let switchMonthYear = await document.getElementsByClassName(
      "ant-picker-calendar-mode-switch"
    );
    switchMonthYear[0].remove();
  };
  useEffect(() => {
    fetchDataContests();
  }, []);

  const calculateExpectedPlace = async ({ idContest }) => {
    axios
      .get(env.API_URL + "/account", {})
      .then(function (responseAccount) {
        axios
          .get(env.API_URL + "/contest", {})
          .then(async function (responseContest) {
            let contest = await responseContest.data.dataContests.find(
              (x) => x.idContest === idContest
            );
            let participants = [];
            for (let i = 0; i < contest.participants.length; i++) {
              let seed = 0;
              let userI = await responseAccount.data.dataAccounts.find(
                (x) => x._id === contest.participants[i].idUser
              );
              for (let j = 0; j < contest.participants.length; j++) {
                if (i !== j) {
                  let userJ = await responseAccount.data.dataAccounts.find(
                    (x) => x._id === contest.participants[j].idUser
                  );
                  seed += Number(
                    1 / (1 + 10 ** ((userI.rating - userJ.rating) / 400))
                  );
                }
              }
              participants.push({
                idUser: userI._id,
                seed: parseInt(seed + 1),
                currentRating: userI.rating,
                ratingChange: 0,
              });
            }
            axios
              .put(env.API_URL + "/update-participants", {
                id: idContest,
                participants: participants,
              })
              .then(function (response) {})
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

  const [modal, warningRegister] = Modal.useModal();
  const Register = ({ id }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận đăng ký cuộc thi này",
      okText: "Đăng ký",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        axios
          .get(env.API_URL + "/contest", {})
          .then(async (response) => {
            let contest = await response.data.dataContests.find(
              (x) => x.idContest === id
            );
            if (contest) {
              axios
                .put(env.API_URL + "/update-participants", {
                  id: id,
                  participants: [
                    ...contest.participants,
                    { idUser: user._id, seed: 0 },
                  ],
                })
                .then(function (response) {
                  axios
                    .get(env.API_URL + "/ranking-contest", {})
                    .then(async (responseRankingContest) => {
                      let rankingContest =
                        await responseRankingContest.data.dataRankingContests.find(
                          (x) => x.idContest === id
                        );
                      if (rankingContest) {
                        let listProblem = [];
                        await contest.problems.forEach((element, index) => {
                          listProblem.push({
                            idProblem: element.idProblem,
                            nameProblem: String.fromCharCode(65 + index),
                            idSubmission: [],
                          });
                        });
                        await axios
                          .put(env.API_URL + "/ranking-contest", {
                            id: id,
                            listUser: [
                              ...rankingContest.listUser,
                              {
                                rank: 9999,
                                idUser: user._id,
                                score: 0,
                                penalty: 0,
                                problems: listProblem,
                              },
                            ],
                          })
                          .then(function (response) {
                            successMessage();
                            fetchDataContests();
                            calculateExpectedPlace({ idContest: id });
                          })
                          .catch(function (error) {
                            console.log(error);
                          });
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    });
  };

  const warningVirtualContest = ({ idContest }) => {
    let idVirtualContest = localStorage.getItem("idVirtualContest")
      ? JSON.parse(localStorage.getItem("idVirtualContest"))
      : null;
    if (!idVirtualContest) {
      modal.confirm({
        title: "CẢNH BÁO",
        icon: <ExclamationCircleOutlined />,
        content:
          "Cuộc thi sẽ được chuyển sang chế độ ảo ngay bây giờ, bạn có chắc chắn?",
        okText: "Tôi hiểu",
        cancelText: "Hủy",
        okType: "danger",
        onOk() {
          axios
            .get(env.API_URL + "/contest", {})
            .then(async function (responseContest) {
              let contest = await responseContest.data.dataContests.find(
                (x) => x.idContest === idContest
              );
              let idContestVirtual = shortid.generate();
              if (contest) {
                axios
                  .post(env.API_URL + "/contest", {
                    idContest: idContestVirtual,
                    nameContest: contest.nameContest,
                    writer: contest.writer,
                    timeStart: moment().format("DD/MM/YYYY HH:mm"),
                    lengthTime: contest.lengthTime,
                    problems: new Array(contest.problems.length)
                      .fill(null)
                      .map((_, i) => {
                        return {
                          ...contest.problems[i],
                          solved: [],
                        };
                      }),
                    rules: contest.rules,
                    virtualMode: true,
                  })
                  .then(function (response) {
                    axios
                      .put(env.API_URL + "/update-participants", {
                        id: idContestVirtual,
                        participants: [{ idUser: user._id, seed: 0 }],
                      })
                      .then(function (response) {
                        axios
                          .post(env.API_URL + "/ranking-contest", {
                            idContest: idContestVirtual,
                            listUser: [],
                          })
                          .then(function (response) {
                            localStorage.setItem(
                              "idVirtualContest",
                              JSON.stringify({
                                idContestVirtual: idContestVirtual,
                                idContest: idContest,
                              })
                            );
                            navigate("/contest/".concat(idContestVirtual));
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
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
      });
    } else if (idVirtualContest.idContest === idContest) {
      navigate("/contest/".concat(idVirtualContest.idContestVirtual));
    } else {
      modal.warning({
        title: "CẢNH BÁO",
        icon: <ExclamationCircleOutlined />,
        content:
          "Bạn đang tham gia một cuộc thi ảo khác, vui lòng thoát khỏi kỳ thi đó!!",
        okText: "Tôi hiểu",
        cancelText: "Hủy",
        okType: "danger",
        onOk() {},
      });
    }
  };

  const [columnsContestAreGoingOn, setColumnsContestAreGoingOn] = useState([]);
  const [columnsContestInTheFuture, setColumnsContestInTheFuture] = useState(
    []
  );
  const [columnsContestHavePassed, setColumnsContestHavePassed] = useState([]);
  setInterval(() => {
    setColumnsContestAreGoingOn([
      {
        title: "Thông tin kỳ thi",
        key: "infoContest",
        width: "70%",
        render: (item) => {
          let timeEnd = moment(item.timeStart, "DD/MM/YYYY HH:mm").add(
            item.lengthTime,
            "minutes"
          );
          let current = moment();
          if (current.isSameOrAfter(timeEnd)) {
            fetchDataContests();
          }
          return (
            <div>
              <a
                href={"/contest/".concat(item.idContest)}
                className="text-cyan-500 text-xl"
              >
                {item.nameContest}
              </a>
              <div>
                Kết thúc trong{" "}
                {timeEnd.diff(current, "days") !== 0 && (
                  <span>{timeEnd.diff(current, "days")} ngày </span>
                )}{" "}
                {parseInt(
                  parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600) /
                    10
                ) !== 0
                  ? parseInt((timeEnd.diff(current, "seconds") % 86400) / 3600)
                  : "0".concat(
                      parseInt(
                        (timeEnd.diff(current, "seconds") % 86400) / 3600
                      )
                    )}
                :
                {parseInt(
                  parseInt(
                    ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                  ) / 10
                ) !== 0
                  ? parseInt(
                      ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                    )
                  : "0".concat(
                      parseInt(
                        ((timeEnd.diff(current, "seconds") % 86400) % 3600) / 60
                      )
                    )}
                :
                {parseInt(
                  parseInt(
                    ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                  ) / 10
                ) !== 0
                  ? parseInt(
                      ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                    )
                  : "0".concat(
                      parseInt(
                        ((timeEnd.diff(current, "seconds") % 86400) % 3600) % 60
                      )
                    )}
              </div>
              <div className="mt-2 font-normal text-gray-400 text-base">
                Bắt đầu thi: {item.timeStart}
              </div>
              <div className="font-normal text-gray-400 text-base">
                Thời gian làm bài:{" "}
                {parseInt(item.lengthTime / 1440) !== 0 && (
                  <span>
                    {parseInt(parseInt(item.lengthTime / 1440) / 10) !== 0
                      ? parseInt(item.lengthTime / 1440)
                      : "0".concat(parseInt(item.lengthTime / 1440))}{" "}
                    ngày{" "}
                  </span>
                )}
                <span>
                  {parseInt(parseInt((item.lengthTime % 1440) / 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) / 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) / 60))}{" "}
                  giờ{" "}
                  {parseInt(parseInt((item.lengthTime % 1440) % 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) % 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) % 60))}{" "}
                  phút{" "}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Thành viên",
        key: "participant",
        align: "center",
        width: "10%",
        render: (item) => <div>{item.participants.length}</div>,
      },
      {
        title: "Đăng ký",
        key: "register",
        align: "center",
        render: (item) => {
          if (!item.participants.find((x) => x.idUser === user._id)) {
            return (
              <Button onClick={() => Register({ id: item.idContest })}>
                Đăng ký
              </Button>
            );
          } else {
            return <div className="italic">Đã đăng ký</div>;
          }
        },
      },
    ]);
    setColumnsContestInTheFuture([
      {
        title: "Thông tin kỳ thi",
        key: "infoContest",
        render: (item) => {
          let timeStart = moment(item.timeStart, "DD/MM/YYYY HH:mm");
          let current = moment();
          if (current.isSameOrAfter(timeStart)) {
            fetchDataContests();
          }
          return (
            <div>
              <a
                href={"/contest/".concat(item.idContest)}
                className="text-cyan-500 text-xl"
              >
                {item.nameContest}
              </a>{" "}
              {/*Link to detail contest*/}
              <div>
                Bắt đầu trong{" "}
                {timeStart.diff(current, "days") !== 0 && (
                  <span>{timeStart.diff(current, "days")} ngày </span>
                )}{" "}
                {parseInt(
                  parseInt(
                    (timeStart.diff(current, "seconds") % 86400) / 3600
                  ) / 10
                ) !== 0
                  ? parseInt(
                      (timeStart.diff(current, "seconds") % 86400) / 3600
                    )
                  : "0".concat(
                      parseInt(
                        (timeStart.diff(current, "seconds") % 86400) / 3600
                      )
                    )}
                :
                {parseInt(
                  parseInt(
                    ((timeStart.diff(current, "seconds") % 86400) % 3600) / 60
                  ) / 10
                ) !== 0
                  ? parseInt(
                      ((timeStart.diff(current, "seconds") % 86400) % 3600) / 60
                    )
                  : "0".concat(
                      parseInt(
                        ((timeStart.diff(current, "seconds") % 86400) % 3600) /
                          60
                      )
                    )}
                :
                {parseInt(
                  parseInt(
                    ((timeStart.diff(current, "seconds") % 86400) % 3600) % 60
                  ) / 10
                ) !== 0
                  ? parseInt(
                      ((timeStart.diff(current, "seconds") % 86400) % 3600) % 60
                    )
                  : "0".concat(
                      parseInt(
                        ((timeStart.diff(current, "seconds") % 86400) % 3600) %
                          60
                      )
                    )}
              </div>
              <div className="mt-2 font-normal text-gray-400 text-base">
                Bắt đầu thi: {item.timeStart}
              </div>
              <div className="font-normal text-gray-400 text-base">
                Thời gian làm bài:{" "}
                {parseInt(item.lengthTime / 1440) !== 0 && (
                  <span>
                    {parseInt(parseInt(item.lengthTime / 1440) / 10) !== 0
                      ? parseInt(item.lengthTime / 1440)
                      : "0".concat(parseInt(item.lengthTime / 1440))}{" "}
                    ngày{" "}
                  </span>
                )}
                <span>
                  {parseInt(parseInt((item.lengthTime % 1440) / 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) / 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) / 60))}{" "}
                  giờ{" "}
                  {parseInt(parseInt((item.lengthTime % 1440) % 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) % 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) % 60))}{" "}
                  phút{" "}
                </span>
              </div>
            </div>
          );
        },
      },
    ]);
    setColumnsContestHavePassed([
      {
        title: "Thông tin kỳ thi",
        key: "infoContest",
        width: "75%",
        render: (item) => {
          return (
            <div>
              <a
                href={"/contest/".concat(item.idContest)}
                className="text-cyan-500 text-xl"
              >
                {item.nameContest}
              </a>{" "}
              {/*Link to detail contest*/}
              <div className="mt-2 font-normal text-gray-400 text-base">
                Bắt đầu thi: {item.timeStart}
              </div>
              <div className="font-normal text-gray-400 text-base">
                Thời gian làm bài:{" "}
                {parseInt(item.lengthTime / 1440) !== 0 && (
                  <span>
                    {parseInt(parseInt(item.lengthTime / 1440) / 10) !== 0
                      ? parseInt(item.lengthTime / 1440)
                      : "0".concat(parseInt(item.lengthTime / 1440))}{" "}
                    ngày{" "}
                  </span>
                )}
                <span>
                  {parseInt(parseInt((item.lengthTime % 1440) / 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) / 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) / 60))}{" "}
                  giờ{" "}
                  {parseInt(parseInt((item.lengthTime % 1440) % 60) / 10) !== 0
                    ? parseInt((item.lengthTime % 1440) % 60)
                    : "0".concat(parseInt((item.lengthTime % 1440) % 60))}{" "}
                  phút{" "}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Thành viên",
        key: "participant",
        width: "10%",
        align: "center",
        render: (item) => <div>{item.participants.length}</div>,
      },
      {
        title: "Tham gia",
        key: "join",
        align: "center",
        render: (item) => (
          <Button
            onClick={() => warningVirtualContest({ idContest: item.idContest })}
          >
            Tham gia ảo
          </Button>
        ),
      },
    ]);
  }, 1000);
  const [key, setKey] = useState("contests");
  const onChange = (key) => {
    setKey(key);
    if (key === "calendar") {
      fixUI();
    }
  };
  const searchContest = async ({ value }) => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(async (responseContest) => {
        setContestsHavePassed(
          await responseContest.data.dataContests.filter(
            (x) =>
              moment().isAfter(
                moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
                  x.lengthTime,
                  "minutes"
                )
              ) && x.nameContest.includes(value)
          )
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getListData = (value) => {
    let checkExist = allContest.filter(
      (x) =>
        parseInt(moment(x.timeStart, "DD/MM/YYYY HH:mm").format("D")) ===
          value.date() &&
        parseInt(moment(x.timeStart, "DD/MM/YYYY HH:mm").format("M")) - 1 ===
          value.month() &&
        parseInt(moment(x.timeStart, "DD/MM/YYYY HH:mm").format("YYYY")) ===
          value.year()
    );
    return checkExist;
  };
  const dateCellRender = (value) => {
    const data = getListData(value);
    if (data.length > 0) {
      return (
        <div>
          {data.map((item, index) => (
            <a
              href={"/contest/".concat(item.idContest)}
              title={item.nameContest}
            >
              <div className="font-bold">{item.nameContest}</div>
            </a>
          ))}
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };
  return (
    <Layout>
      {warningRegister}
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
          <Tabs
            onChange={onChange}
            type="card"
            items={new Array(2).fill(null).map((_, i) => {
              if (i === 0) {
                return {
                  label: "Các kỳ thi",
                  key: "contests",
                };
              } else {
                return {
                  label: "Lịch",
                  icon: <CalendarOutlined />,
                  key: "calendar",
                };
              }
            })}
          />
          {key === "contests" && (
            <div>
              <div className="text-2xl font-bold">Các kỳ thi đang diễn ra</div>
              <Divider />
              {contestsAreGoingOn.length > 0 ? (
                <Table
                  columns={columnsContestAreGoingOn}
                  dataSource={contestsAreGoingOn}
                />
              ) : (
                <div className="italic">Chưa có kỳ thi nào đang diễn ra</div>
              )}
              <Divider />
              <div className="text-2xl font-bold">Các kỳ thi sắp diễn ra</div>
              <Divider />
              {contestsInTheFuture.length > 0 ? (
                <Table
                  columns={columnsContestInTheFuture}
                  dataSource={contestsInTheFuture}
                />
              ) : (
                <div className="italic">Chưa có kỳ thi nào được lên lịch</div>
              )}
              <Divider />
              <div className="text-2xl font-bold">Các kỳ thi đã qua</div>
              <Divider />
              <div className="justify-end flex">
                <div className="mr-5 font-medium text-lg">
                  Tìm kiếm kỳ thi:{" "}
                </div>
                <Input.Search
                  allowClear
                  size="middle"
                  style={{ width: 500 }}
                  onPressEnter={(e) => searchContest({ value: e.target.value })}
                  onSearch={(e) => searchContest({ value: e })}
                />
              </div>
              {contestsHavePassed.length > 0 ? (
                <Table
                  columns={columnsContestHavePassed}
                  dataSource={contestsHavePassed}
                />
              ) : (
                <div className="italic">Chưa có kỳ thi nào trong quá khứ</div>
              )}
            </div>
          )}
          {key === "calendar" && <Calendar cellRender={cellRender} />}
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
