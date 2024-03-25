import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Test from "./components/test";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import Problem from "./pages/Problem";
import DetailProblem from "./pages/DetailProblem";
import Submission from "./pages/Submissions.js";
import Profile from "./pages/Profile.js";
import Contest from "./pages/Contest.js";
import DetailContest from "./pages/DetailContest.js";
import Member from "./pages/Member.js";
import Education from "./pages/Education.js";
import { useEffect, useState } from "react";
import axios from "axios";

import * as env from "./env.js";
import moment from "moment";

function App() {
  const [infoProblem, setInfoProblem] = useState({});

  const getAnswer = async ({ GetSolution, testcase }) => {
    if (GetSolution) {
      let ans = null;
      let maxTime = 0,
        maxMemory = 0,
        lastTestCase = GetSolution.length - 1;
      for (let i = GetSolution.length - 1; i >= 0; i--) {
        if (GetSolution[i].status.description !== "Accepted") {
          lastTestCase = i;
          ans = {
            status: `${GetSolution[i].status.description} test ${i + 1}`,
            output: GetSolution,
            lastTestCase: i,
            maxTime: maxTime * 1000,
            maxMemory: maxMemory,
          };
        }
      }
      if (ans === null) {
        lastTestCase = GetSolution.length - 1;
        ans = {
          status: `Accepted`,
          output: GetSolution,
          lastTestCase: GetSolution.length - 1,
          maxTime: maxTime * 1000,
          maxMemory: maxMemory,
        };
      }
      ans = {
        status: ans.status,
        output: ans.output,
        lastTestCase: ans.lastTestCase,
        maxTime:
          Math.max(
            ...GetSolution.filter(
              (element, index) => index <= lastTestCase
            ).map((element, index) => Number(element.time))
          ) * 1000,
        maxMemory: Math.max(
          ...GetSolution.filter((element, index) => index <= lastTestCase).map(
            (element, index) => element.memory
          )
        ),
      };
      return ans;
    } else {
      return {
        status: "Compilation Error",
        output: [],
        lastTestCase: 0,
        maxTime: 0,
        maxMemory: 0,
      };
    }
  };

  const runTestCase = async ({
    submission,
    testcase,
    currentSubmission,
    idProblem,
    idUser,
    memoryLimit,
  }) => {
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": env.key_Judge0_API,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: {
        submissions: submission,
      },
    };

    const response = await axios.request(options).catch(function (error) {
      console.log(error);
    });
    const options1 = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: response?.data?.map((v) => v.token).join(","),
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Key": env.key_Judge0_API,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "content-type": "application/json",
      },
    };

    let GetSolution = [
      {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      },
    ];

    while (
      GetSolution[0].stdout == null &&
      GetSolution[0].time == null &&
      GetSolution[0].memory == null &&
      GetSolution[0].stderr == null &&
      GetSolution[0].compile_output == null
    ) {
      if (response?.data[0].token) {
        const response1 = await axios.request(options1).catch(function (error) {
          console.log(error);
        });
        GetSolution = await response1?.data?.submissions;
        if (!GetSolution) {
          break;
        }
      }
    }

    // console.log(GetSolution);
    //output: stdout
    //error: stderr
    //compiler_error: compile_output
    let answer = await getAnswer({
      GetSolution: GetSolution,
      testcase: testcase,
    });
    let output = [];
    for (let i = 0; i < answer.output.length; i++) {
      output.push({
        ...answer.output[i],
        stdout: answer.output[i].status.description.includes("Runtime")
          ? ""
          : answer.output[i].stdout,
      });
    }
    await axios
      .put(env.API_URL + "/update-submission", {
        id: currentSubmission,
        numberOfAcceptedTestCase: answer.lastTestCase,
        detailTestCase: output,
        maxTime: answer.maxTime,
        maxMemory: answer.maxMemory,
        status:
          answer.maxMemory >= memoryLimit && answer.status.includes("Runtime")
            ? `Memory Limit Exceeded test ${answer.lastTestCase + 1}`
            : answer.status,
      })
      .then(function (responseUpdateSubmission) {
        if (answer.status === "Accepted") {
          axios
            .get(env.API_URL + "/problems", {})
            .then(async (response) => {
              let solved = await response.data.dataProblems.filter(
                (x) => x.idProblem === idProblem
              )[0].solved;
              await solved.push(idUser);
              axios
                .put(env.API_URL + "/update-solved-problems", {
                  id: idProblem,
                  solved: solved,
                })
                .then(function (responseUpdateProblem) {})
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
  };

  const grading = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (responseProblem) {
        axios
          .get(env.API_URL + "/submission", {})
          .then(async (responseSubmission) => {
            let checkExist =
              await responseSubmission.data.dataSubmissions.filter(
                (x) =>
                  x.status === "Đang chờ" || x.status.includes("Processing")
              );
            if (checkExist.length > 0) {
              checkExist.forEach(async (element) => {
                let problem = await responseProblem.data.dataProblems.filter(
                  (x) => x.idProblem === element.idProblem
                )[0];
                let submission = [];
                await problem.testCase.forEach((test) => {
                  submission.push({
                    language_id: element.idLanguage,
                    stdin: test.input,
                    source_code: element.source,
                    expected_output: test.output,
                    cpu_time_limit: problem.timeLimit,
                    memory_limit: problem.memoryLimit * 1024,
                  });
                });
                await runTestCase({
                  submission: submission,
                  testcase: problem.testCase,
                  currentSubmission: element.idSubmission,
                  idProblem: element.idProblem,
                  idUser: element.idUser,
                  memoryLimit: problem.memoryLimit * 1024,
                });
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
    axios
      .get(env.API_URL + "/ranking-contest", {})
      .then(function (responseRankingContest) {
        axios
          .get(env.API_URL + "/contest", {})
          .then(async function (responseContest) {
            let contestHavePassed = await responseContest.data.dataContests
              .filter(
                (x) =>
                  moment().isAfter(
                    moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
                      x.lengthTime,
                      "minutes"
                    )
                  ) &&
                  x.virtualMode === false &&
                  x.ratingChange === false
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
              });
            for (let i = 0; i < contestHavePassed.length; i++) {
              let participants = [];
              let ranking =
                await responseRankingContest.data.dataRankingContests.find(
                  (x) => x.idContest === contestHavePassed[i].idContest
                );
              for (
                let j = 0;
                j < contestHavePassed[i].participants.length;
                j++
              ) {
                let userOfContest = await ranking.listUser.find(
                  (x) =>
                    x.idUser === contestHavePassed[i].participants[j].idUser
                );
                if (userOfContest) {
                  let change =
                    (contestHavePassed[i].participants[j].seed -
                      userOfContest.rank) *
                    20;
                  participants.push({
                    ...contestHavePassed[i].participants[j],
                    ratingChange: change,
                  });
                }
              }
              for (let j = 0; j < participants.length; j++) {
                await axios
                  .put(env.API_URL + "/update-rating", {
                    id: participants[j].idUser,
                    rating: Math.max(
                      0,
                      participants[j].currentRating +
                        participants[j].ratingChange
                    ),
                  })
                  .then(function (response) {})
                  .catch(function (error) {
                    console.log(error);
                  });
              }
              await axios
                .put(env.API_URL + "/update-participants", {
                  id: contestHavePassed[i].idContest,
                  participants: participants,
                })
                .then(function (response) {
                  axios
                    .put(env.API_URL + "/update-rating-contest", {
                      id: contestHavePassed[i].idContest,
                      ratingChange: true,
                    })
                    .then(function (response) {})
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
    const interval = setInterval(() => grading(), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {/* <button onClick={grading}>bdwdwjdnww</button> */}
      <Routes>
        <Route path="/test" element={<Test />}></Route>
        <Route
          path="/problems"
          element={
            <Problem currentTab="problems" setInfoProblem={setInfoProblem} />
          }
        ></Route>
        <Route
          path="/problems/:idProblem"
          element={
            <DetailProblem currentTab="problems" infoProblem={infoProblem} />
          }
        ></Route>
        <Route
          path="/submissions"
          element={<Submission currentTab="submissions" />}
        ></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route path="/reset-password/:idReset" element={<ResetPassword />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/administration" element={<Admin />}></Route>
        <Route path="/profile/:idUser" element={<Profile />}></Route>
        <Route
          path="/contest"
          element={<Contest currentTab="contest" />}
        ></Route>
        <Route
          path="/contest/:idContest"
          element={<DetailContest currentTab="contest" />}
        ></Route>
        <Route path="/users" element={<Member currentTab="users" />}></Route>
        <Route
          path="/education"
          element={<Education currentTab="education" />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
