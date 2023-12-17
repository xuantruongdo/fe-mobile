import { Button, Form, Input, Divider, message, notification } from 'antd';
import { useState } from 'react';
import { callLogin } from '../services/api';

const Login = () => {

    const [isSubmit, setIsSubmit] = useState(false);


    const onFinish = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        let data = { username: username, password }
        const res = await callLogin(data);
        setIsSubmit(false);
        if (res?.data && res.data._id) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            message.success("Đăng nhập thành công");
            localStorage.setItem('user', JSON.stringify(res.data));
            window.location.href = '/';
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: 
                  res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    

    return ( 
        <div style={{ padding: "50px" }}>
            <h3 style={{ textAlign: "center" }}>ĐĂNG NHẬP</h3>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập username !' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu !' }]}
                >
                <Input.Password />
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng nhập
                </Button>
                </Form.Item>
            </Form>
        </div>
     );
}
 
export default Login;