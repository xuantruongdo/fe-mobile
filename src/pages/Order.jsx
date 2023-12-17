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
import { callChangeStatus, callFetchOrders } from "../services/api";
import moment from "moment";
import Meta from "antd/es/card/Meta";

const STATUS_LIST = [
  { label: "PENDING", value: "PENDING" },
  { label: "PROCESSING", value: "PROCESSING" },
  { label: "REJECT", value: "REJECT" },
  { label: "SUCCESS", value: "SUCCESS" },
];

const Order = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayOrder, setDisplayOrder] = useState([]);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [listProduct, setListProduct] = useState([]);

  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
    let list = record.listProduct;
    setListProduct(JSON.parse(list));
  };

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Order List</span>
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
            // onClick={() => setOpenModalCreate(true)}
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
      title: "Fullname",
      dataIndex: "fullname",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (text, record, index) => {
        return (
          <p>{(record.total + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</p>
        );
      },
    },
  ];

  const onClose = () => {
    setOpen(false);
  };

  const fetchDisplayOrders = async () => {
    setLoading(true);
    const res = await callFetchOrders();
    if (res && res?.data) {
      setDisplayOrder(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDisplayOrders();
  }, []);

  useEffect(() => {
    const init = {
      _id: dataViewDetail?._id,
      status: dataViewDetail?.status,
    };
    form.setFieldsValue(init);
  }, [dataViewDetail]);

  const onFinish = async (values) => {
    const { _id, status } = values;
    if (dataViewDetail.status !== "SUCCESS") {
      setLoading(true)
      const res = await callChangeStatus({ _id, newStatus: status });
      if (res && res.data) {
        message.success("Successfully");
        fetchDisplayOrders();
        setOpen(false);
      }
      setLoading(false)
    }

  };

  const handleChangeStatus = () => {
    form.submit();
  };

  return (
    <div>
      <Table
        title={renderHeader}
        loading={loading}
        columns={columns}
        dataSource={displayOrder}
        scroll={{ x: true }}
      />
      <Drawer
        title="Order Detail"
        placement="right"
        width={700}
        onClose={onClose}
        open={open}
        extra={
          <Button
            loading={loadingForm}
            type="primary"
            onClick={handleChangeStatus}
          >
            Change status
          </Button>
        }
      >
        <Descriptions title="Order Detail" bordered column={1}>
          <Descriptions.Item label="ID">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="User">
            {dataViewDetail?.userID}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Form form={form} onFinish={onFinish}>
              <Col span={0}>
                <Form.Item name={"_id"}>
                  <Input />
                </Form.Item>
              </Col>
              <Form.Item name={"status"}>
                <Select
                  style={{ width: "100%" }}
                  defaultValue={dataViewDetail?.status}
                  options={STATUS_LIST}
                ></Select>
              </Form.Item>
            </Form>
          </Descriptions.Item>
          <Descriptions.Item label="Product">
            {listProduct.map((item, index) => (
              <Card style={{ width: 400 }} key={index}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <img src={item.productImage} alt="" width={"100px"} />
                  <div>
                    <b>{item.productName}</b>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <p>
                        {(item.productPrice + "")?.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}{" "}
                        đ
                      </p>
                      <p>x</p>
                      <p>{item.productQuantity}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default Order;
