import React, { useEffect, useState } from "react";
import { Button, Select, Space } from "antd";
import Editor from "@monaco-editor/react";
import axios from "axios";

import * as env from "../env.js";

import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function Submit({
  idProblemFromContest,
  idContest,
  setKeyMain,
}) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const shortid = require("shortid");
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [lang, setLang] = useState(54);
  const [nameLanguage, setNameLanguage] = useState("C++");
  const [compileLanguage, setCompileLanguage] = useState("cpp");

  const { idProblem } = useParams();
  const [infoProblem, setInfoProblem] = useState({});

  useEffect(() => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (response) {
        if (idProblemFromContest) {
          setInfoProblem(
            response.data.dataProblems.filter(
              (x) => x.idProblem === idProblemFromContest
            )[0]
          );
        } else {
          setInfoProblem(
            response.data.dataProblems.filter(
              (x) => x.idProblem === idProblem
            )[0]
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [idProblemFromContest]);

  const handleChange = (value) => {
    setCompileLanguage(value);
    if (value === "cpp") {
      setLang(54);
      setNameLanguage("C++");
    } else if (value === "c") {
      setLang(50);
      setNameLanguage("C");
    } else if (value === "csharp") {
      setLang(51);
      setNameLanguage("C#");
    } else if (value === "python") {
      setLang(71);
      setNameLanguage("Python");
    } else if (value === "java") {
      setLang(62);
      setNameLanguage("Java");
    } else if (value === "javascript") {
      setLang(63);
      setNameLanguage("JavaScript");
    }
  };

  const Submit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    let idSubmission = await shortid.generate();
    axios
      .post(env.API_URL + "/submission", {
        idSubmission: idSubmission,
        idProblem: infoProblem.idProblem,
        idUser: user._id,
        idContest: idContest ? idContest : "none",
        source: code,
        detailTestCase: infoProblem.testCase,
        maxTime: 0,
        maxMemory: 0,
        status: "Đang chờ",
        idLanguage: lang,
        language: nameLanguage,
        createTime: moment().format("DD/MM/YYYY HH:mm"),
        time: moment().format("YYYY-MM-DD"),
      })
      .then(async (response) => {
        if (idProblemFromContest) {
          setKeyMain("MySubmissions");
        } else {
          navigate("/submissions");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="p-5">
      <div className="text-3xl mb-3">
        Nộp bài tập{" "}
        <Link
          to={"/problems/".concat(infoProblem.idProblem)}
          className="text-cyan-600"
        >
          {infoProblem.nameProblem}
        </Link>
      </div>
      <Space className="flex mb-4" style={{ height: "5vh" }}>
        <div className="text-xl">Chọn ngôn ngữ: </div>
        <Select
          className="justify-start"
          placeholder="Chọn ngôn ngữ"
          style={{
            width: 150,
          }}
          options={[
            {
              label: "C",
              value: "c",
            },
            {
              label: "C++",
              value: "cpp",
            },
            {
              label: "C#",
              value: "csharp",
            },
            {
              label: "Python",
              value: "python",
            },
            {
              label: "Java",
              value: "java",
            },
            {
              label: "JavaScript",
              value: "javascript",
            },
          ]}
          defaultValue="cpp"
          onChange={handleChange}
        />
        <Button
          className="bg-sky-500	text-white hover:bg-sky-300 ml-5"
          onClick={Submit}
        >
          Nộp bài
        </Button>
      </Space>

      <Editor
        height="100vh"
        language={compileLanguage}
        theme="vs-dark"
        loading
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}
