import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Test from "./components/test";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Problem from "./pages/Problem";
import DetailProblem from "./pages/DetailProblem";
import Submit from "./components/submit";
import Submission from "./components/submission";
import { useEffect, useState } from "react";
import axios from "axios";

import * as env from "./env.js";

function App() {
  const [hiddenTag, setHiddenTag] = useState(false);
  const [infoProblem, setInfoProblem] = useState({});

  // const [answer, setAnswer] = useState({});

  const fixValue = async ({ newValue }) => {
    let s = "";
    for (let i = 0; i < newValue.length; i++) {
      s += newValue[i];
    }
    while (
      s.charCodeAt(s.length - 1) === 10 ||
      s.charCodeAt(s.length - 1) === 32
    ) {
      s = s.substring(0, s.length - 1);
    }
    return s;
  };

  // const COMPARE = ({ output, correctOutput }) => {
  //   if (!output.length || !correctOutput.length) {
  //     return false;
  //   }
  //   let s1 = "",
  //     s2 = "";
  //   for (let i = 0; i < output.length; i++) {
  //     s1 += output[i];
  //   }
  //   for (let i = 0; i < correctOutput.length; i++) {
  //     s2 += correctOutput[i];
  //   }
  //   while (
  //     s1.charCodeAt(s1.length - 1) === 10 ||
  //     s1.charCodeAt(s1.length - 1) === 32
  //   ) {
  //     s1 = s1.substring(0, s1.length - 1);
  //   }
  //   while (
  //     s2.charCodeAt(s2.length - 1) === 10 ||
  //     s2.charCodeAt(s2.length - 1) === 32
  //   ) {
  //     s2 = s2.substring(0, s2.length - 1);
  //   }
  //   return s1 === s2;
  // };

  const getAnswer = async ({ GetSolution, testcase }) => {
    let ans = null;
    let maxTime = 0,
      maxMemory = 0;
    for (let i = GetSolution.length - 1; i >= 0; i--) {
      if (GetSolution[i].time !== null && GetSolution[i].memory !== null) {
        maxTime = Math.max(maxTime, Number(GetSolution[i].time));
        maxMemory = Math.max(maxMemory, Number(GetSolution[i].memory));
      }
      if (GetSolution[i].status.description !== "Accepted") {
        ans = {
          status: `${GetSolution[i].status.description} test ${i + 1}`,
          output: GetSolution,
          lastTestCase: i,
          maxTime: maxTime * 1000,
          maxMemory: maxMemory,
        };
      } else if (GetSolution[i].stdout) {
        if (
          (await fixValue({ newValue: GetSolution[i].stdout })) !==
          testcase[i].output
        ) {
          ans = {
            status: `Sai test ${i + 1}`,
            output: GetSolution,
            lastTestCase: i,
            maxTime: maxTime * 1000,
            maxMemory: maxMemory,
          };
        }
      } else if (GetSolution[i].stderr) {
        ans = {
          status: `Lỗi test ${i + 1}`,
          output: GetSolution,
          lastTestCase: i,
          maxTime: maxTime * 1000,
          maxMemory: maxMemory,
        };
      } else {
        ans = {
          status: `Lỗi biên dịch test ${i + 1}`,
          output: GetSolution,
          lastTestCase: i,
          maxTime: maxTime * 1000,
          maxMemory: maxMemory,
        };
      }
    }
    if (ans === null) {
      ans = {
        status: `Accepted`,
        output: GetSolution,
        lastTestCase: GetSolution.length - 1,
        maxTime: maxTime * 1000,
        maxMemory: maxMemory,
      };
    }
    return ans;
  };

  const runTestCase = async ({ submission, testcase, currentSubmission }) => {
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

    const response = await axios.request(options);
    const options1 = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: response.data.map((v) => v.token).join(","),
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
      if (response.data[0].token) {
        const response1 = await axios.request(options1);
        GetSolution = await response1.data.submissions;
      }
    }
    //output: stdout
    //error: stderr
    //compiler_error: compile_output
    let answer = await getAnswer({
      GetSolution: GetSolution,
      testcase: testcase,
    });
    // console.log(answer);
    await axios
      .put(env.API_URL + "/update-submission", {
        id: currentSubmission,
        numberOfAcceptedTestCase: answer.lastTestCase,
        detailTestCase: answer.output,
        maxTime: answer.maxTime,
        maxMemory: answer.maxMemory,
        status: answer.status,
      })
      .then(function (responseUpdateSubmission) {})
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
                (x) => x.status === "Đang chờ"
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
  };
  // useEffect(() => {
  //   const interval = setInterval(() => grading(), 1000);
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <div>
      <button onClick={grading}>bdwdwjdnww</button>
      <Routes>
        <Route path="/test" element={<Test />}></Route>
        <Route
          path="/problems"
          element={
            <Problem
              currentTab="problems"
              hiddenTag={hiddenTag}
              setHiddenTag={setHiddenTag}
              setInfoProblem={setInfoProblem}
            />
          }
        ></Route>
        <Route
          path="/problems/:idProblem"
          element={
            <DetailProblem
              currentTab="problems"
              hiddenTag={hiddenTag}
              infoProblem={infoProblem}
            />
          }
        ></Route>
        <Route
          path="/problems/submit"
          element={<Submit currentTab="problems" infoProblem={infoProblem} />}
        ></Route>
        <Route
          path="/submissions"
          element={<Submission currentTab="submissions" />}
        ></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/administration" element={<Admin />}></Route>
      </Routes>
    </div>
  );
}

export default App;
