import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const items = [
  {
    label: <Link to="/problems" className="font-bold">DANH SÁCH BÀI</Link>,
    key: "problems",
  },
  {
    label: <Link to="/submissions" className="font-bold">CÁC BÀI NỘP</Link>,
    key: "submissions",
  },
  {
    label: <Link to="/contest" className="font-bold">CÁC KỲ THI</Link>,
    key: "contest",
  },
  {
    label: <Link to="/users" className="font-bold">THÀNH VIÊN</Link>,
    key: "users",
  },
  {
    label: <Link to="/education" className="font-bold">HỌC TẬP</Link>,
    key: "education",
  },
  {
    label: <Link to="/administration" className="font-bold">QUẢN LÝ</Link>,
    key: "administration",
  },
];

const LoginLogout = [
        {
            label: <Link to="/login">ĐĂNG NHẬP</Link>,
            key: "login",
          },
          {
            label: <Link to="/register">ĐĂNG KÝ</Link>,
            key: "register",
          },
]
const HeaderPage = () => {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        alignItems: "center",
        opacity: 0.9
      }}
    >
      <Link to="/">
        <img width={100} src="/Images/logo-TDMU.png" />
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
        }}
        className="justify-center items-center"
        onClick={(e) => console.log(e)}
      />
      <Menu
        theme="dark"
        mode="horizontal"
        items={LoginLogout}
        className="justify-center items-center"
        onClick={(e) => console.log(e)}
      />
    </Header>
  );
};

export default HeaderPage;
