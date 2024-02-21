import React, { useEffect, useState } from "react";
import { Layout, theme, Tabs, Menu, Divider } from "antd";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import Problem from "../components/detailProblem.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const { Content } = Layout;

export default function DetailContest() {
  const navigate = useNavigate();
  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
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
  const { idContest } = useParams();
  const [keyMain, setKeyMain] = useState("problems");
  const [contest, setContest] = useState({});
  const [listProblems, setListProblems] = useState([]);
  const [idProblem, setIdProblem] = useState("");

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
      key: "submissions",
      label: "Các bài nộp",
    },
  ];
  useEffect(() => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(async (response) => {
        let contest = await response.data.dataContests.filter(
          (x) => x.idContest === idContest
        )[0];
        setContest(contest);
        setInterval(
          () =>
            countDownTime({
              timeStart: contest.timeStart,
              lengthTime: contest.lengthTime,
            }),
          1000
        );
        setListProblems(
          new Array(contest.problems.length).fill(null).map((item, index) => {
            return getItem(
              <span className="font-medium text-base">
                {contest.problems[index].nameProblem}
              </span>,
              contest.problems[index].idProblem
            );
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [remainTime, setRemainTime] = useState("");
  const countDownTime = ({ timeStart, lengthTime }) => {
    let timeEnd = moment(timeStart, "DD/MM/YYYY HH:mm").add(
      lengthTime,
      "minutes"
    );
    let current = moment();
    if (current.isSameOrAfter(timeEnd)) {
      navigate("/contest");
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
          <Tabs
            defaultActiveKey="1"
            type="card"
            items={itemsMain}
            onChange={(e) => setKeyMain(e)}
          />
          {keyMain === "problems" && (
            <div className="w-full flex">
              <div className="w-1/4 flex flex-col items-center">
                <Menu
                  mode="inline"
                  items={listProblems}
                  onClick={(e) => setIdProblem(e.key)}
                />
                <Divider />
                <div className="text-2xl font-bold">{contest.nameContest}</div>
                <div className="font-normal text-xl flex flex-col">
                  <div>
                    Thời gian làm bài:{" "}
                    {parseInt(contest.lengthTime / 1440) !== 0 && (
                      <span>
                        {parseInt(parseInt(contest.lengthTime / 1440) / 10) !==
                        0
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
                  <span className="text-red-500 font-bold">{remainTime}</span>
                </div>
              </div>
              <div className="w-3/4 justify-end">
                {idProblem !== "" && (
                  <Problem
                    idProblemFromContest={idProblem}
                    idContest={contest.idContest}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
