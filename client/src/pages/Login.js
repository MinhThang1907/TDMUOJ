import React, { useEffect, useState } from "react";
import { Input, Layout, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";

const { Content } = Layout;

export default function Login() {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [result, setResult] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);

  useEffect(() => {
    axios
      .get(env.API_URL + "/account", {})
      .then(function (response) {
        setDataUsers(response.data.dataAccounts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginAccount = () => {
    setResult(false);
    if (
      dataUsers.filter(
        (x) => x.username === username && x.password === password
      ).length > 0
    ) {
      localStorage.setItem(
        "dataUser",
        JSON.stringify(
          dataUsers.filter(
            (x) => x.username === username && x.password === password
          )[0]
        )
      );
      navigate("/");
    } else {
      setResult(true);
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
          <div className="flex justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center mb-8">
                <img
                  src="/Images/logo-TDMU.png"
                  alt="Logo"
                  className="w-30 h-20"
                />
              </div>
              <h1 className="uppercase text-2xl font-semibold text-center text-gray-500 mt-8 mb-6">
                Đăng nhập
              </h1>
              <div>
                <div className="mb-4">
                  <label
                    for="nombre"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Tài khoản
                  </label>
                  <Input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    for="password"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Mật khẩu
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {result && (
                  <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    Tên tài khoản hoặc mật khẩu không đúng
                  </div>
                )}
                <button
                  type="submit"
                  className="w-32 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2"
                  onClick={loginAccount}
                >
                  Đăng nhập
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" className="text-cyan-600">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
