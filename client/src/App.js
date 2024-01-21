import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Test from "./components/test";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Problem from "./pages/Problem";
import DetailProblem from "./pages/DetailProblem";
import Submit from "./components/submit";
import { useState } from "react";

function App() {
  const [hiddenTag, setHiddenTag] = useState(false);
  const [infoProblem, setInfoProblem] = useState({});
  return (
    <div>
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
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/administration" element={<Admin />}></Route>
      </Routes>
    </div>
  );
}

export default App;
