import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
  notification,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { callFetchUsers } from "../services/api";

const User = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [displayUser, setDisplayUser] = useState([]);
  const fetchDisplayUsers = async () => {
    setLoading(true);
    const res = await callFetchUsers();
    if (res && res?.data) {
      setDisplayUser(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDisplayUsers();
  }, []);

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>User List</span>
      </div>
    );
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return <a href="#">{record._id}</a>;
      },
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
  ];

  return (
    <Table
      title={renderHeader}
      loading={loading}
      columns={columns}
      dataSource={displayUser}
      scroll={{ x: true }}
    />
  );
};

export default User;
