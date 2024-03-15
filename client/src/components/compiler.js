import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Select, Input, Button } from "antd";
import axios from "axios";

import * as env from "../env.js";

export default function Compiler() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState(54);
  const [compileLanguage, setCompileLanguage] = useState("cpp");

  const Submit = async () => {
    if (code === "") {
      setOutput("Không có mã nguồn");
      return;
    }
    setOutput("Đang biên dịch...");
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": env.key_Judge0_API,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          stdin: input,
          language_id: lang,
          cpu_time_limit: 1,
          memory_limit: 262144,
        }),
      }
    );
    setOutput("Đang chạy...");
    const jsonResponse = await response.json();

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };

    while (
      jsonGetSolution.stdout == null &&
      jsonGetSolution.time == null &&
      jsonGetSolution.memory == null &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": env.key_Judge0_API,
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
        console.log(jsonGetSolution);
      }
    }
    if (jsonGetSolution.status.description !== "Accepted") {
      setOutput(jsonGetSolution.status.description);
    } else if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      setOutput(
        `Kết quả :\n\n${output}\n\nThời gian chạy : ${jsonGetSolution.time} giây\nBộ nhớ : ${jsonGetSolution.memory} kilobytes`
      );
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);

      setOutput(`Lỗi :${error}`);
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      setOutput(`Lỗi biên dịch :${compilation_error}`);
    }
  };
  const handleChange = (value) => {
    setCompileLanguage(value);
    if (value === "cpp") {
      setLang(54);
    } else if (value === "c") {
      setLang(50);
    } else if (value === "csharp") {
      setLang(51);
    } else if (value === "python") {
      setLang(71);
    } else if (value === "java") {
      setLang(62);
    } else if (value === "javascript") {
      setLang(63);
    }
  };
  const test = async () => {
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
        submissions: [
          {
            language_id: lang,
            stdin: input,
            source_code: code,
          },
          {
            language_id: lang,
            stdin: input,
            source_code: code,
          },
          {
            language_id: lang,
            stdin: input,
            source_code: code,
          },
        ],
      },
    };

    try {
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

      try {
        let GetSolution = [
          {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
          },
        ];

        while (GetSolution[0].status.description !== "Accepted") {
          if (response.data[0].token) {
            const response1 = await axios.request(options1);
            GetSolution = await response1.data.submissions;
          }
        }
        if (GetSolution.stdout !== null) {
          const output = GetSolution[0].stdout;
          console.log(output);
        } else if (GetSolution.stderr !== null) {
          const error = GetSolution[0].stderr;
          console.log(error);
        } else {
          const compilation_error = GetSolution[0].compile_output;
          console.log(compilation_error);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="w-full flex">
        <div className="w-1/2">
          <div className="flex" style={{ height: "5vh" }}>
            <Select
              className="justify-start"
              placeholder="Chọn ngôn ngữ"
              style={{
                width: 150,
                marginBottom: 5,
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
              Chạy
            </Button>
          </div>
          <Editor
            height="100vh"
            language={compileLanguage}
            theme="vs-dark"
            loading
            onChange={(value) => setCode(value)}
          />
        </div>
        <div className="w-1/2">
          <label
            className="block uppercase tracking-wide text-gray-700 text-base font-bold ml-3"
            style={{ height: "5vh" }}
          >
            Đầu vào:
          </label>
          <Input.TextArea
            style={{
              height: "50vh",
              resize: "none",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <label
            className="block uppercase tracking-wide text-gray-700 text-base font-bold ml-3"
            style={{ height: "5vh" }}
          >
            Đầu ra:
          </label>
          <Input.TextArea
            style={{
              height: "45vh",
              resize: "none",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
            }}
            readOnly
            value={output}
          />
        </div>
      </div>
    </div>
  );
}
