import React, { useEffect, useState } from "react";

import ChangeAvatar from "./changeAvatar";
import { Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

import * as env from "../env.js";

export default function EditProfile({ fetchProfile }) {
  const [messageApi, contextHolder] = message.useMessage();
  const successMessage = ({ content }) => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg: "",
  });
  let user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  useEffect(() => {
    if (user) {
      // console.log(user);
      setPicture({
        cropperOpen: false,
        img: user.avatar,
        zoom: 2,
        croppedImg: user.avatar,
      });
    }
  }, []);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [errorOldEmail, setErrorOldEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errorOldPassword, setErrorOldPassword] = useState("");

  const [errorLengthPassword, setErrorLengthPassword] = useState(false);
  const updateName = () => {
    setUpdateNameLoading(true);
    axios
      .put(env.API_URL + "/update-account", {
        id: user._id,
        password: user.password,
        email: user.email,
        name: newName,
      })
      .then(function (response) {
        // console.log(response);
        axios
          .get(env.API_URL + "/account", {})
          .then(async function (response) {
            let checkExist = await response.data.dataAccounts.find(
              (x) => x._id === user._id
            );
            if (checkExist) {
              localStorage.setItem("dataUser", JSON.stringify(checkExist));
              user = localStorage.getItem("dataUser")
                ? JSON.parse(localStorage.getItem("dataUser"))
                : null;
              // console.log(user);
              successMessage({ content: "Cập nhật họ tên thành công" });
              setNewName("");
              fetchProfile();
              setUpdateNameLoading(false);
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
  const updateEmail = () => {
    setUpdateEmailLoading(true);
    if (user.email === oldEmail) {
      setErrorOldEmail(false);
      axios
        .put(env.API_URL + "/update-account", {
          id: user._id,
          password: user.password,
          email: newEmail,
          name: user.name,
        })
        .then(function (response) {
          // console.log(response);
          axios
            .get(env.API_URL + "/account", {})
            .then(async function (response) {
              let checkExist = await response.data.dataAccounts.find(
                (x) => x._id === user._id
              );
              if (checkExist) {
                localStorage.setItem("dataUser", JSON.stringify(checkExist));
                user = localStorage.getItem("dataUser")
                  ? JSON.parse(localStorage.getItem("dataUser"))
                  : null;
                // console.log(user);
                successMessage({ content: "Cập nhật email thành công" });
                setNewEmail("");
                setOldEmail("");
                fetchProfile();
                setUpdateEmailLoading(false);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setUpdateEmailLoading(false);
      setErrorOldEmail(true);
    }
  };
  const updatePassword = () => {
    setUpdatePasswordLoading(true);
    if (user.password === oldPassword) {
      setErrorOldPassword(false);
      if (newPassword.length < 8) {
        setUpdatePasswordLoading(false);
        setErrorLengthPassword(true);
      } else {
        setErrorLengthPassword(false);
        axios
          .put(env.API_URL + "/update-account", {
            id: user._id,
            password: newPassword,
            email: user.email,
            name: user.name,
          })
          .then(function (response) {
            // console.log(response);
            axios
              .get(env.API_URL + "/account", {})
              .then(async function (response) {
                let checkExist = await response.data.dataAccounts.find(
                  (x) => x._id === user._id
                );
                if (checkExist) {
                  localStorage.setItem("dataUser", JSON.stringify(checkExist));
                  user = localStorage.getItem("dataUser")
                    ? JSON.parse(localStorage.getItem("dataUser"))
                    : null;
                  // console.log(user);
                  successMessage({ content: "Cập nhật mật khẩu thành công" });
                  setNewPassword("");
                  setOldPassword("");
                  fetchProfile();
                  setUpdatePasswordLoading(false);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      setUpdatePasswordLoading(false);
      setErrorOldPassword(true);
    }
  };
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  return (
    <div className="col-span-4 sm:col-span-9">
      {contextHolder}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 pt-4">
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Thay đổi ảnh đại diện
          </label>
          <div className="mb-8">
            <div className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
              <div>
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  <ChangeAvatar
                    picture={picture}
                    setPicture={setPicture}
                    fetchProfile={fetchProfile}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 pt-4">
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Thay đổi họ tên
          </label>
          <div className="mb-8">
            <div className="relative flex flex-col justify-start rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
              <Input
                placeholder="Nhập họ tên mới"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div
                className="w-1/6 mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
                onClick={updateName}
              >
                {updateNameLoading ? <LoadingOutlined /> : "Cập nhật"}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 pt-4">
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Thay đổi Email
          </label>
          <div className="mb-8">
            <div className="relative flex flex-col justify-start rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
              <div className="flex justify-start mb-1">Nhập email cũ:</div>
              <Input
                placeholder="Nhập email cũ"
                value={oldEmail}
                onChange={(e) => setOldEmail(e.target.value)}
                className="mb-2"
              />
              {errorOldEmail && (
                <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Có vẻ như email cũ không đúng
                </div>
              )}
              <div className="flex justify-start mb-1">Nhập email mới:</div>
              <Input
                placeholder="Nhập email mới"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <div
                className="w-1/6 mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
                onClick={updateEmail}
              >
                {updateEmailLoading ? <LoadingOutlined /> : "Cập nhật"}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 pt-4">
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Thay đổi mật khẩu
          </label>
          <div className="mb-8">
            <div className="relative flex flex-col justify-start rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
              <div className="flex justify-start mb-1">Nhập mật khẩu cũ:</div>
              <Input
                type="password"
                placeholder="Nhập mật khẩu cũ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              {errorOldPassword && (
                <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Có vẻ như mật khẩu cũ không đúng
                </div>
              )}
              <div className="flex justify-start mb-1">Nhập mật khẩu mới:</div>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errorLengthPassword && (
                <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Độ dài mật khẩu tối thiểu là 8 ký tự
                </div>
              )}
              <div
                className="w-1/6 mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
                onClick={updatePassword}
              >
                {updatePasswordLoading ? <LoadingOutlined /> : "Cập nhật"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
