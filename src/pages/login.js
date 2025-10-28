import React from "react";
import {Form, Input, Button, Checkbox, Card, message, Typography} from "antd";
import axios from "axios";
import {setLocalStorage} from "@/utils/storage";
import {router} from "next/client";
import {setLoading} from "@/store/dialogReducer";
import {useDispatch} from "react-redux";
const { Title, Text } = Typography;


const LoginPage = () => {
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        dispatch(setLoading(true));
        axios.post("/api/proxy/auth/login", values).then(function (res) {
            if(res.status === 201){
                localStorage.setItem("token", res.data?.token);
                router.replace("/");
            }
        }).catch(function (error) {
            message.error(`Login Failed! ${error}`);
        }).finally(function () {
            dispatch(setLoading(false));
        })

    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error("Login Failed!");
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f0f2f5",
            }}
        >
            <Card style={{ width: 420}}>
                <Title level={4} style={{ textAlign: "center" }}>
                    Login
                </Title>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="id"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>

                    <Text>
                        Don’t have an account?{" "}
                        <a href={"/register"} style={{ cursor: "pointer", color: "var(--color-primary)" }}>
                            Register
                        </a>
                    </Text>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
