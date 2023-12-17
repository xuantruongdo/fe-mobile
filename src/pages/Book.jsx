import { useEffect, useState } from "react";
import {
  Button,
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
import { callDeleteBook, callFetchBooks } from "../services/api";
import moment from "moment/moment";
import ModalCreateBook from "../components/book/ModalCreateBook";
import ModalUpdateBook from "../components/book/ModalUpdateBook";

const Book = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayBook, setDisplayBook] = useState([]);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataViewUpdate, setDataViewUpdate] = useState({});

  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const showModalUpdate = (record) => {
    setOpenModalUpdate(true);
    setDataViewUpdate(record);
  };


  const handleDeleteBook = async (id) => {
    const res = await callDeleteBook(id)
    if (res && res.data) {
      message.success("Deleted successfully")
      fetchDisplayBooks();
    }
  }

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Book List</span>
        <div
          className="render-header-right"
          style={{
            display: "flex",
            gap: 15,
          }}
        >
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Create
          </Button>
          <Button
            type="ghost"
            // onClick={reload}
          >
            <ReloadOutlined />
          </Button>
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a href="#" onClick={() => showDrawer(record)}>
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (text, record, index) => {
        return <img src={record.image} alt="" style={{ width: "100px" }} />;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record, index) => {
        return (
          <p>{(record.price + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</p>
        );
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm
              placement="leftTop"
              title={"Confirm delete this product"}
              description={"Are you sure you want to delete this book?"}
                onConfirm={() => handleDeleteBook(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteOutlined style={{ color: "#ff4d4f" }} />
              </span>
            </Popconfirm>

            <span
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => showModalUpdate(record)}
            >
              <EditOutlined style={{ color: "#f57800" }} />
            </span>
          </div>
        );
      },
    },
  ];

  const onClose = () => {
    setOpen(false);
  };

  const fetchDisplayBooks = async () => {
    setLoading(true);
    const res = await callFetchBooks();
    if (res && res?.data) {
      setDisplayBook(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDisplayBooks();
  }, []);

  return (
    <div>
      <Form
        form={form}
        name="form-filter"
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Row gutter={[16, 16]} justify="space-arround">
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
          <Col xs={24} sm={0}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenModalCreate(true)}
            >
              Create
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        title={renderHeader}
        loading={loading}
        columns={columns}
        dataSource={displayBook}
        scroll={{ x: true }}
      />
      <Drawer
        title="Book Detail"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Descriptions title="Book Detail" bordered column={1}>
          <Descriptions.Item label="ID">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {dataViewDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Author">
            {dataViewDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            <p>
              {(dataViewDetail?.price + "")?.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}{" "}
              đ
            </p>
          </Descriptions.Item>
          <Descriptions.Item label="Import Price">
            <p>
              {(dataViewDetail?.importPrice + "")?.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}{" "}
              đ
            </p>
          </Descriptions.Item>
          <Descriptions.Item label="Stock">
            {dataViewDetail?.stock}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>

      <ModalCreateBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayBooks={fetchDisplayBooks}
      />

      <ModalUpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataViewUpdate={dataViewUpdate}
        fetchDisplayBooks={fetchDisplayBooks}
      />
    </div>
  );
};

export default Book;
