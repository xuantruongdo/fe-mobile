import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BankOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";

const { Content, Sider } = Layout;

const Home = () => {
  const userAdmin = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  useEffect(() => {
    if (!userAdmin) {
      navigate("/login");
    }
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      key: 1,
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      link: "/",
    },

    {
      key: 2,
      icon: <UserOutlined />,
      label: "Module User",
      link: "/user",
    },
    {
      key: 3,
      icon: <FileTextOutlined />,
      label: "Manage Book",
      link: "/book",
    },
    {
      key: 4,
      icon: <BankOutlined />,
      label: "Order",
      link: "/order",
    },
  ];

  const [activeMenu, setActiveMenu] = React.useState("1");

  const handleMenuItemClick = (key, link) => {
    setActiveMenu(key);
    navigate(link);
  };
  return (
    <>
      <Header />
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[activeMenu]}
            onClick={(e) => setActiveMenu(e.key)}
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleMenuItemClick(item.key, item.link)}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
