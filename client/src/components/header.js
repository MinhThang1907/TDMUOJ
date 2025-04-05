import { useEffect, useState } from "react"
import { Layout, Menu } from "antd"
import { Link } from "react-router-dom"
import axios from "axios"
import { MenuOutlined } from "@ant-design/icons"

import * as env from "../env.js"

const { Header } = Layout

// Define menu items as constants to avoid duplication
const COMMON_MENU_ITEMS = [
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
      <Link to="/courses" className="font-bold">
        KHÓA HỌC
      </Link>
    ),
    key: "courses",
  },
]

// Admin-only menu item
const ADMIN_MENU_ITEM = {
  label: (
    <Link to="/administration" className="font-bold">
      QUẢN LÝ
    </Link>
  ),
  key: "administration",
}

const HeaderPage = ({ currentTab }) => {
  const [items, setItems] = useState([])
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle virtual contest cleanup
  const cleanupVirtualContest = async (virtualContest) => {
    if (!virtualContest) return

    try {
      await axios.put(env.API_URL + "/delete-contest", {
        id: virtualContest.idContestVirtual,
      })

      await axios.put(env.API_URL + "/delete-ranking-contest", {
        id: virtualContest.idContestVirtual,
      })

      localStorage.removeItem("idVirtualContest")
    } catch (error) {
      console.log("Error cleaning up virtual contest:", error)
    }
  }

  // Logout function
  const handleLogout = async () => {
    localStorage.removeItem("dataUser")
    localStorage.removeItem("hiddenAcceptedProblem")
    localStorage.removeItem("hiddenTagProblem")

    const virtualContest = localStorage.getItem("idVirtualContest")
      ? JSON.parse(localStorage.getItem("idVirtualContest"))
      : null

    await cleanupVirtualContest(virtualContest)
    fetchData()
  }

  // Fetch user data and set menu items
  const fetchData = () => {
    const currentUser = localStorage.getItem("dataUser") ? JSON.parse(localStorage.getItem("dataUser")) : null

    setUser(currentUser)

    // Set menu items based on user role
    if (currentUser && currentUser.role === "admin") {
      setItems([...COMMON_MENU_ITEMS, ADMIN_MENU_ITEM])
    } else {
      setItems(COMMON_MENU_ITEMS)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Login/Register menu items
  const loginRegisterItems = [
    {
      label: <Link to="/login">ĐĂNG NHẬP</Link>,
      key: "login",
    },
    {
      label: <Link to="/register">ĐĂNG KÝ</Link>,
      key: "register",
    },
  ]

  // User profile and logout menu items
  const userMenuItems = user
    ? [
        {
          label: (
            <a href={`/profile/${user._id}`}>
              Xin chào, <span className="font-bold">{user.username.split("@")[0]}</span>
            </a>
          ),
          key: "profile",
        },
        {
          label: (
            <a href="/" onClick={handleLogout}>
              ĐĂNG XUẤT
            </a>
          ),
          key: "logout",
        },
      ]
    : []

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <Header className="sticky top-0 z-50 w-full flex items-center bg-white shadow-sm px-4">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Link to="/">
          <img width={80} height={40} src="/Images/logo-TDMU.png" alt="TDMU Logo" className="h-10 w-auto" />
        </Link>

        <button className="lg:hidden text-gray-700 focus:outline-none" onClick={toggleMobileMenu}>
          <MenuOutlined style={{ fontSize: "24px" }} />
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-1">
        <Menu
          theme="light"
          mode="horizontal"
          items={items}
          className="flex-1 min-w-0 justify-center"
          defaultSelectedKeys={[currentTab]}
        />

        <Menu
          theme="light"
          mode="horizontal"
          items={user ? userMenuItems : loginRegisterItems}
          className="justify-center"
        />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md lg:hidden z-50">
          <Menu theme="light" mode="vertical" items={items} className="w-full" defaultSelectedKeys={[currentTab]} />
          <Menu
            theme="light"
            mode="vertical"
            items={user ? userMenuItems : loginRegisterItems}
            className="w-full border-t"
          />
        </div>
      )}
    </Header>
  )
}

export default HeaderPage

