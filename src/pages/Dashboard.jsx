import { useEffect, useState } from "react";
import { Card, Col, Row, Space } from "antd";
import {
  callFetchBooks,
  callFetchOrders,
  callFetchUsers,
} from "../services/api";
import {
  UserOutlined,
  BankOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import DashboardCard from "../components/dashboard/dashboardCard";
import LineChartComp from "../components/dashboard/lineChart";

const Dashboard = () => {
  const [countUser, setCountUser] = useState(0);
  const [countBook, setCountBook] = useState(0);
  const [countOrder, setCountOrder] = useState(0);

  const fetchCountUser = async () => {
    const res = await callFetchUsers();
    if (res && res.data) {
      setCountUser(res.data.length);
    }
  };

  const fetchCountBook = async () => {
    const res = await callFetchBooks();
    if (res && res.data) {
      setCountBook(res.data.length);
    }
  };

  const fetchCountOrder = async () => {
    const res = await callFetchOrders();
    if (res && res.data) {
      setCountOrder(res.data.length);
    }
  };

  useEffect(() => {
    fetchCountUser();
    fetchCountBook();
    fetchCountOrder();
  }, []);

  let data = [
    { name: "User", sl: countUser },
    { name: "Book", sl: countBook },
    { name: "Order", sl: countOrder },
  ];

  console.log(countBook);
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <DashboardCard
            icon={<UserOutlined style={{ fontSize: 30 }} />}
            title={"User"}
            value={countUser}
          />
        </Col>
        <Col span={8}>
          <DashboardCard
            icon={<BankOutlined style={{ fontSize: 30 }} />}
            title={"Book"}
            value={countBook}
          />
        </Col>
        <Col span={8}>
          <DashboardCard
            icon={<ScheduleOutlined style={{ fontSize: 30 }} />}
            title={"Order"}
            value={countOrder}
          />
        </Col>
          </Row>
          <LineChartComp data={ data } />
    </div>
  );
};

export default Dashboard;
