import React, { useEffect, useState } from "react";
import { Input, Layout, theme, Modal, Result, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";

const { Content } = Layout;

export default function Register() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [result, setResult] = useState(false);
  const [differentPassword, setDifferentPassword] = useState(false);
  const [differentAccount, setDifferentAccount] = useState(false);
  const [lengthPassword, setLengthPassword] = useState(false);

  const [modal, warningRegister] = Modal.useModal();

  const registerAccount = () => {
    setDifferentPassword(false);
    setDifferentAccount(false);
    setLengthPassword(false);
    if (password !== confirmPassword) {
      setDifferentPassword(true);
    }
    if (dataUsers.filter((x) => x.username === username).length > 0) {
      setDifferentAccount(true);
    }
    if (password.length < 8) {
      setLengthPassword(true);
    }
    if (
      password === confirmPassword &&
      dataUsers.filter((x) => x.username === username).length === 0 &&
      password.length >= 8
    ) {
      modal.confirm({
        title: "XÁC NHẬN",
        icon: <ExclamationCircleOutlined />,
        content: "Xác nhận đăng ký",
        cancelText: "Hủy",
        okText: "Xác nhận",
        okType: "text",
        onOk() {
          axios
            .post(env.API_URL + "/account", {
              username: username,
              password: password,
              email: email,
              name: name,
              role: "user",
            })
            .then(function (response) {
              setResult(true);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
      });
    }
  };
  return (
    <Layout>
      {warningRegister}
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
          {result ? (
            <Result
              status="success"
              title="Bạn đã đăng ký tài khoản thành công"
              subTitle="Sự góp mặt của bạn góp phần làm gia tăng sự nhiệt huyết của cộng đồng thuật toán"
              extra={[
                <Link to="/login">
                  <Button>Đi đến trang đăng nhập</Button>
                </Link>,
              ]}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-8">
                  <img
                    src="/Images/logo-TDMU.png"
                    alt="Logo"
                    className="w-30 h-20"
                  />
                </div>
                <h1 className="uppercase text-2xl font-semibold text-center text-gray-500 mt-8 mb-6">
                  Đăng ký
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
                    {differentAccount && (
                      <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        Tên đăng nhập đã tồn tại
                      </div>
                    )}
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
                    {lengthPassword && (
                      <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        Độ dài mật khẩu tối thiểu là 8 ký tự
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      for="confirmPassword"
                      className="block mb-2 text-sm text-gray-600"
                    >
                      Nhập lại mật khẩu
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {differentPassword && (
                      <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        Mật khẩu không khớp
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      for="email"
                      className="block mb-2 text-sm text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      for="fullname"
                      className="block mb-2 text-sm text-gray-600"
                    >
                      Họ và tên (Có thể trống)
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-32 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2"
                    onClick={registerAccount}
                  >
                    Đăng ký
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm">
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login" className="text-cyan-600">
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
