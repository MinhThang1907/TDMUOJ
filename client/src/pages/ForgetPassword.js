import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Layout, theme } from "antd";
import emailjs from "@emailjs/browser";
import shortid from "shortid";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import axios from "axios";

const { Content } = Layout;

export default function ForgetPassword() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const form = useRef();
  const [email, setEmail] = useState("");
  const [idResetPassword, setIdResetPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setIdResetPassword(shortid.generate());
  }, []);
  const sendEmail = () => {
    setLoading(true);
    axios
      .get(env.API_URL + "/account", {})
      .then(async function (responseAccount) {
        let account = await responseAccount.data.dataAccounts.find(
          (x) => x.email === email
        );
        if (account) {
          setErrorEmail(false);
          emailjs
            .sendForm("service_14s1kks", "template_kcdew28", form.current, {
              publicKey: "Np1USQm28ddak3AC9",
            })
            .then(function (response) {
              axios
                .post(env.API_URL + "/reset-password", {
                  idReset: idResetPassword,
                  email: email,
                })
                .then(function (response) {
                  setSuccess(true);
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          setErrorEmail(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
            <div className=" max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center items-center">
                <form ref={form}>
                  <span className="mr-5">Nhập email của bạn: </span>
                  <span>
                    <input
                      name="from_name"
                      value="TDMUOJ"
                      className=" hidden"
                    />
                    <input
                      name="message"
                      value={
                        "Nhấn vào đường dẫn sau để xác nhận: " +
                        env.URL +
                        "/reset-password/" +
                        idResetPassword
                      }
                      className=" hidden"
                    />
                    <Input
                      className=" w-[300px]"
                      onChange={(e) => setEmail(e.target.value)}
                      name="to_email"
                    />
                    {errorEmail && (
                      <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        Không tìm thấy tài khoản nào sử dụng email này
                      </div>
                    )}
                  </span>
                </form>
              </div>
              <div className=" mt-5 flex justify-center items-center">
                {!success ? (
                  <Button onClick={sendEmail} disabled={loading}>
                    Yêu cầu
                  </Button>
                ) : (
                  <div className=" text-green-500">
                    Yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra
                    email.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
