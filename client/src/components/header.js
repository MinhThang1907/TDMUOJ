import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const HeaderPage = ({ currentTab }) => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const fetchData = () => {
    let currentUser = localStorage.getItem("dataUser")
      ? JSON.parse(localStorage.getItem("dataUser"))
      : null;
    setUser(currentUser);
    if (currentUser && currentUser.role === "admin") {
      setItems([
        {
          label: (
            <Link to="/problems" className="font-bold">
              DANH SÁCH BÀI
            </Link>
          ),
          key: "problems",
        },
        {
          label: (
            <Link to="/submissions" className="font-bold">
              CÁC BÀI NỘP
            </Link>
          ),
          key: "submissions",
        },
        {
          label: (
            <Link to="/contest" className="font-bold">
              CÁC KỲ THI
            </Link>
          ),
          key: "contest",
        },
        {
          label: (
            <Link to="/users" className="font-bold">
              THÀNH VIÊN
            </Link>
          ),
          key: "users",
        },
        {
          label: (
            <Link to="/education" className="font-bold">
              HỌC TẬP
            </Link>
          ),
          key: "education",
        },
        {
          label: (
            <Link to="/administration" className="font-bold">
              QUẢN LÝ
            </Link>
          ),
          key: "administration",
        },
      ]);
    } else {
      setItems([
        {
          label: (
            <Link to="/problems" className="font-bold">
              DANH SÁCH BÀI
            </Link>
          ),
          key: "problems",
        },
        {
          label: (
            <Link to="/submissions" className="font-bold">
              CÁC BÀI NỘP
            </Link>
          ),
          key: "submissions",
        },
        {
          label: (
            <Link to="/contest" className="font-bold">
              CÁC KỲ THI
            </Link>
          ),
          key: "contest",
        },
        {
          label: (
            <Link to="/users" className="font-bold">
              THÀNH VIÊN
            </Link>
          ),
          key: "users",
        },
        {
          label: (
            <Link to="/education" className="font-bold">
              HỌC TẬP
            </Link>
          ),
          key: "education",
        },
      ]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const Logout = () => {
    localStorage.removeItem("dataUser");
    fetchData();
  };

  const LoginRegister = [
    {
      label: <Link to="/login">ĐĂNG NHẬP</Link>,
      key: "login",
    },
    {
      label: <Link to="/register">ĐĂNG KÝ</Link>,
      key: "register",
    },
  ];
  const UserLogout = [
    {
      label: (
        <Link to="/profile">
          Xin chào, <span className="font-bold">{user && user.username}</span>
        </Link>
      ),
      key: "profile",
    },
    {
      label: (
        <Link to="/" onClick={Logout}>
          ĐĂNG XUẤT
        </Link>
      ),
      key: "logout",
    },
  ];
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        alignItems: "center",
        opacity: 0.9,
      }}
    >
      <Link to="/">
        <img width={100} src="/Images/logo-TDMU.png" alt="" />
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
        defaultSelectedKeys={[currentTab]}
      />
      {user ? (
        <Menu
          theme="dark"
          mode="horizontal"
          items={UserLogout}
          className="justify-center items-center"
        />
      ) : (
        <Menu
          theme="dark"
          mode="horizontal"
          items={LoginRegister}
          className="justify-center items-center"
        />
      )}
    </Header>
  );
};

export default HeaderPage;
