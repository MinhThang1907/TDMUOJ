import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Select, Input, Button } from "antd";

export default function Compiler({ defaultInput }) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState(54);
  const [compileLanguage, setCompileLanguage] = useState("cpp");

  const Submit = async () => {
    setOutput("Đang biên dịch...");
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "bba61640c9msh15defd185341764p1c0ba2jsn5e8d0e8171ff",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          stdin: input,
          language_id: lang,
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
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "bba61640c9msh15defd185341764p1c0ba2jsn5e8d0e8171ff",
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      setOutput(
        `Kết quả :\n\n${output}\n\nThời gian chạy : ${jsonGetSolution.time} giây\nBộ nhớ : ${jsonGetSolution.memory} bytes`
      );
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);

      setOutput(`Lỗi :${error}`);
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      setOutput(`Lỗi :${compilation_error}`);
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
              Run
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
