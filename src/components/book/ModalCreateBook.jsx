import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Button,
  Upload,
  message,
  Card,
  notification,
  InputNumber,
} from "antd";
import { useState } from "react";
import {
  callCreateBook,
  callCreateImport,
  callUploadImage,
} from "../../services/api";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const ModalCreateBook = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchDisplayBooks } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [cover, setCover] = useState();

  const handleCancel = () => {
    setOpenModalCreate(false);
    // form.resetFields();
  };

  const onFinish = async (values) => {
    let { name, price, importPrice, quantity, author } = values;
    let data = {
      name,
      price,
      importPrice,
      stock: quantity,
      author,
      image: cover,
    };
    setLoading(true);
    const res = await callCreateBook(data);
    console.log(res);
    if (res && res.data) {
      setOpenModalCreate(false);
      fetchDisplayBooks();
      form.resetFields();

      const resImport = await callCreateImport({
        bookId: res.data.data._id,
        importPrice,
        quantity,
      });
      if (resImport && resImport.data) {
        message.success("Successfully");
        setImageUrl("")
        setCover("")
      }
    }
    setLoading(false);
  };

  const handleUploadSingleFile = async ({ file, onSuccess, onError }) => {
    const res = await callUploadImage(file);
    if (res && res.data) {
      setCover(res.data.data);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <Modal
      className="modal-custom-width"
      title="Create a new book"
      width={"50%"}
      open={openModalCreate}
      onCancel={handleCancel}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={loading}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter=" đ"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Import price"
              name="importPrice"
              rules={[{ required: true, message: "Please enter import price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter=" đ"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Author"
              name="author"
              rules={[{ required: true, message: "Please enter author" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label="Image" name="image">
              <Upload
                name="logo"
                listType="picture-card"
                className="avatar-uploader"
                multiple={false}
                maxCount={1}
                customRequest={handleUploadSingleFile}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreateBook;
