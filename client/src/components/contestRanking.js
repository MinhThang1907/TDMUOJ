import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

import * as env from "../env.js";
import moment from "moment";

export default function ContestRanking() {
  const [column, setColumn] = useState([]);
  const [dataRanking, setDataRanking] = useState([]);
  let setIntervalFetchRanking;
  const { idContest } = useParams();
  const fetchDataRanking = () => {
    axios
      .get(env.API_URL + "/submission", {})
      .then(function (responseSubmission) {
        axios
          .get(env.API_URL + "/account", {})
          .then(async (responseAccount) => {
            axios
              .get(env.API_URL + "/contest", {})
              .then(async (responseContest) => {
                let contest = await responseContest.data.dataContests.find(
                  (x) => x.idContest === idContest
                );
                await axios
                  .get(env.API_URL + "/ranking-contest", {})
                  .then(async (responseRanking) => {
                    let ranking = responseRanking.data.dataRankingContests.find(
                      (x) => x.idContest === idContest
                    );
                    if (ranking) {
                      let columns = [
                        {
                          title: "Hạng",
                          dataIndex: "rank",
                          key: "rank",
                          width: "10%",
                          align: "center",
                        },
                        {
                          title: "Tên truy cập",
                          dataIndex: "idUser",
                          key: "idUser",
                          align: "center",
                          render: (_, item) => {
                            let currentUser =
                              responseAccount.data.dataAccounts.find(
                                (x) => x._id === item.idUser
                              );
                            return (
                              <div className="text-base font-semibold mb-4">
                                {currentUser?.rating < 1200 ? (
                                  <a href={"/profile/".concat(currentUser._id)}
                                    className="text-stone-400 hover:text-stone-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 1400 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-green-500 hover:text-green-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 1600 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-cyan-300 hover:text-cyan-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 1900 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-blue-600 hover:text-blue-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 2100 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-purple-500 hover:text-purple-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 2400 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-amber-500 hover:text-amber-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : currentUser?.rating < 2600 ? (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-pink-600 hover:text-pink-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                ) : (
                                  <a
                                    href={"/profile/".concat(currentUser._id)}
                                    className="text-red-600 hover:text-red-400"
                                  >
                                    {currentUser?.name
                                      ? currentUser.name
                                      : currentUser?.username}
                                  </a>
                                )}
                              </div>
                            );
                          },
                        },
                        {
                          title: "Điểm",
                          dataIndex: "score",
                          key: "score",
                          width: "10%",
                          align: "center",
                        },
                        {
                          title: "Phạt",
                          dataIndex: "penalty",
                          key: "penalty",
                          width: "10%",
                          align: "center",
                        },
                      ];
                      for (let i = 0; i < contest.problems.length; i++) {
                        columns.push({
                          title: String.fromCharCode(65 + i),
                          dataIndex: contest.problems[i].idProblem,
                          key: contest.problems[i].idProblem,
                          align: "center",
                          width: "10%",
                          render: (problem, user) => {
                            let score = 0;
                            let submissions =
                              responseSubmission.data.dataSubmissions.filter(
                                (x) =>
                                  x.idUser === user.idUser &&
                                  x.idProblem === problem.idProblem &&
                                  x.idContest === idContest &&
                                  (x.status === "Accepted" ||
                                    x.status.includes("Wrong") ||
                                    x.status.includes("Time") ||
                                    x.status.includes("Memory") ||
                                    x.status.includes("Runtime"))
                              );
                            // console.log(submissions);
                            if (submissions.length === 0) {
                              return <div></div>;
                            } else {
                              for (let i = 0; i < submissions.length; i++) {
                                if (submissions[i].status !== "Accepted") {
                                  score -= 1;
                                }
                              }
                              if (score === 0) {
                                return (
                                  <div>
                                    <span className="text-green-500 font-bold">
                                      1
                                    </span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div>
                                    <span className="text-red-500 font-bold">
                                      {score}
                                    </span>
                                  </div>
                                );
                              }
                            }
                          },
                        });
                      }
                      setColumn(columns);
                      let data = [];
                      for (let i = 0; i < ranking.listUser.length; i++) {
                        let user = {
                          rank: ranking.listUser[i].rank,
                          idUser: ranking.listUser[i].idUser,
                          score: ranking.listUser[i].score,
                          penalty: ranking.listUser[i].penalty,
                        };
                        for (
                          let j = 0;
                          j < ranking.listUser[i].problems.length;
                          j++
                        ) {
                          user[ranking.listUser[i].problems[j].idProblem] =
                            ranking.listUser[i].problems[j];
                        }
                        data.push(user);
                      }
                      setDataRanking(data);
                    }
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const updateRanking = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (responseProblem) {
        axios
          .get(env.API_URL + "/contest", {})
          .then(async (responseContest) => {
            let contest = await responseContest.data.dataContests.find(
              (x) => x.idContest === idContest
            );
            if (contest) {
              axios
                .get(env.API_URL + "/submission", {})
                .then(async (responseSubmission) => {
                  let listUser = [];
                  for (let i = 0; i < contest.participants.length; i++) {
                    let score = 0;
                    let problems = [];
                    for (let j = 0; j < contest.problems.length; j++) {
                      let checkExist =
                        await responseProblem.data.dataProblems.find(
                          (x) => x.idProblem === contest.problems[j].idProblem
                        );
                      if (
                        checkExist &&
                        checkExist.solved.find(
                          (x) => x === contest.participants[i].idUser
                        )
                      ) {
                        score += 1;
                      }
                      problems.push({
                        idProblem: contest.problems[j].idProblem,
                        nameProblem: String.fromCharCode(65 + j),
                        idSubmission: [],
                      });
                    }
                    let penalty = 0;
                    for (let j = 0; j < contest.problems.length; j++) {
                      let submissions =
                        await responseSubmission.data.dataSubmissions.filter(
                          (x) =>
                            x.idUser === contest.participants[i].idUser &&
                            x.idProblem === contest.problems[j].idProblem &&
                            x.idContest === idContest &&
                            (x.status === "Accepted" ||
                              x.status.includes("Wrong") ||
                              x.status.includes("Time") ||
                              x.status.includes("Memory") ||
                              x.status.includes("Runtime"))
                        );
                      for (let k = 0; k < submissions.length; k++) {
                        problems[j]["idSubmission"].push(
                          submissions[k].idSubmission
                        );
                        penalty += moment
                          .duration(
                            moment(
                              submissions[k].createTime,
                              "DD/MM/YYYY HH:mm"
                            ).diff(
                              moment(contest.timeStart, "DD/MM/YYYY HH:mm")
                            )
                          )
                          .asMinutes();
                      }
                    }
                    listUser.push({
                      rank: 9999,
                      idUser: contest.participants[i].idUser,
                      score: score,
                      penalty: penalty,
                      problems: problems,
                    });
                  }
                  listUser.sort((a, b) => {
                    if (a.score === b.score) {
                      return a.penalty - b.penalty;
                    }
                    return b.score - a.score;
                  });
                  let prevRank = 0,
                    prevScore = -1,
                    prevPenalty = -1;
                  for (let i = 0; i < listUser.length; i++) {
                    if (listUser[i].score !== prevScore) {
                      listUser[i].rank = prevRank + 1;
                      prevRank += 1;
                      prevScore = listUser[i].score;
                      prevPenalty = listUser[i].penalty;
                    } else {
                      if (listUser[i].penalty !== prevPenalty) {
                        listUser[i].rank = prevRank + 1;
                        prevRank += 1;
                        prevScore = listUser[i].score;
                        prevPenalty = listUser[i].penalty;
                      } else {
                        listUser[i].rank = prevRank;
                      }
                    }
                  }
                  // console.log(listUser);
                  axios
                    .put(env.API_URL + "/ranking-contest", {
                      id: idContest,
                      listUser: listUser,
                    })
                    .then(function (response) {
                      fetchDataRanking();
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchDataRanking();
    setIntervalFetchRanking = setInterval(() => updateRanking(), 2000);
  }, []);
  return (
    <>
      <Table columns={column} dataSource={dataRanking} pagination={false} />
    </>
  );
}
