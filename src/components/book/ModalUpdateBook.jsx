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
import { callUpdateBook, callUploadImage } from "../../services/api";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

const ModalUpdateBook = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataViewUpdate,
    fetchDisplayBooks,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [cover, setCover] = useState();
  const [initForm, setInitForm] = useState({});

  useEffect(() => {
    if (dataViewUpdate?._id) {
      const image = [
        {
          uid: uuidv4(),
          name: dataViewUpdate.image,
          status: "done",
          url: dataViewUpdate.image,
        },
      ];

      const init = {
        _id: dataViewUpdate._id,
        name: dataViewUpdate.name,
        price: dataViewUpdate.price,
        importPrice: dataViewUpdate.importPrice,
        stock: dataViewUpdate.stock,
        author: dataViewUpdate.author,
        image: { fileList: image },
      };

      setInitForm(init);
      setCover(dataViewUpdate.image);
      form.setFieldsValue(init);
    }

    return () => {
      form.resetFields();
    };
  }, [dataViewUpdate]);
  const handleCancel = () => {
    setOpenModalUpdate(false);
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

  const onFinish = async (values) => {
    const { _id, name, price, author } = values;

    let data = {
      name,
      price,
      author,
      image: cover,
    };
    setLoading(true);

    const res = await callUpdateBook(_id, data);
    if (res && res.data) {
      setOpenModalUpdate(false);
      message.success("Sửa công ty thành công");
      form.resetFields();
      setImageUrl("");
      setCover("");
      fetchDisplayBooks();
    }
    setLoading(false);
  };

  return (
    <Modal
      className="modal-custom-width"
      title="Update a new book"
      width={"50%"}
      open={openModalUpdate}
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
          <Col span={0}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="ID"
              name="_id"
              rules={[{ required: true, message: "Please enter ID" }]}
            >
              <Input />
            </Form.Item>
          </Col>
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

          <Col span={12}>
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

          <Col span={12}>
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
                defaultFileList={initForm?.image?.fileList ?? []}
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

export default ModalUpdateBook;
