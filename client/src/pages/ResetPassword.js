import React, { useState } from "react";
import { Layout, theme, Button, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import { useParams } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

export default function ResetPassword() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { idReset } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = () => {
    if (newPassword.length < 8) {
      setErrorPassword(true);
      return;
    } else {
      setLoading(true);
      setErrorPassword(false);
      axios
        .get(env.API_URL + "/reset-password", {})
        .then(async function (responseResetPassword) {
          let resetPassword =
            await responseResetPassword.data.dataResetPasswords.find(
              (x) => x.idReset === idReset
            );
          if (resetPassword) {
            axios
              .get(env.API_URL + "/account", {})
              .then(async function (responseAccount) {
                let account = await responseAccount.data.dataAccounts.find(
                  (x) => x.email === resetPassword.email
                );
                if (account) {
                  axios
                    .put(env.API_URL + "/update-account", {
                      id: account._id,
                      password: newPassword,
                      email: resetPassword.email,
                    })
                    .then(function (response) {
                      axios
                        .put(env.API_URL + "/delete-reset-password", {
                          id: idReset,
                        })
                        .then(function (response) {
                          window.location.href = "/login";
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
          } else {
            alert("Yêu cầu của bạn đã được xử lý");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const [modal, warning] = Modal.useModal();
  const warningChangePassword = ({ id }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận đổi mật khẩu",
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "dashed",
      onOk() {
        changePassword();
      },
    });
  };
  return (
    <Layout>
      {warning}
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
            <div className=" max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center items-center">
                <span className="mr-5">Nhập mật khẩu mới của bạn: </span>
                <span>
                  <Input
                    type="password"
                    className=" w-[300px]"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {errorPassword && (
                    <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      Mật khẩu phải có ít nhất 8 ký tự
                    </div>
                  )}
                </span>
              </div>
              <div className=" mt-5 flex justify-center items-center">
                <Button onClick={warningChangePassword} disabled={loading}>
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
