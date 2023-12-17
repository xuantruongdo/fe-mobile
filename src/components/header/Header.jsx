import { FaReact } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./header.scss";
import { ConfigProvider, Dropdown, Menu, Space } from "antd";
import {
  TwitterOutlined,
  CodeOutlined,
  RiseOutlined,
  ContactsOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const items = [
  {
    label: <Link to="/">Dashboard</Link>,
    key: "/",
    icon: <TwitterOutlined />,
  },
  {
    label: <Link to={"/user"}>User</Link>,
    key: "/user",
    icon: <UserOutlined />,
  },
  {
    label: <Link to={"/book"}>Book</Link>,
    key: "/book",
    icon: <CodeOutlined />,
  },
  {
    label: <Link to={"/order"}>Order</Link>,
    key: "/order",
    icon: <RiseOutlined />,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate("/login")
  }
  let itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          // onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => handleLogout()}
        >
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <header>
      <div className="container" style={{margin: "0 100px"}}>
        <div style={{ display: "flex", gap: 30 }}>
          <div className="logo">
            <FaReact onClick={() => navigate("/")} title="CRIS ITVIEC" />
          </div>
          <div className="top-menu">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#fff",
                  colorBgContainer: "#222831",
                  colorText: "#a7a7a7",
                },
              }}
            >
              <Menu selectedKeys={[current]} mode="horizontal" items={items} />
            </ConfigProvider>
            <div className="extra">
              <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
                <Space style={{ cursor: "pointer", color: "white" }}>
                  <span>Welcome ADMIN</span>
                </Space>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
