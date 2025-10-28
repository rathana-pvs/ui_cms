import React from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import axios from "axios";
import {router} from "next/client";
import {setLoading} from "@/store/dialogReducer";

const { Title, Text } = Typography;

const RegisterPage = () => {
    const onFinish = (values) => {
        axios.post("/api/proxy/auth/register", values).then(function (res) {
            if(res.status === 201){
                router.replace("/login");
            }
        }).catch(function (error) {
            message.error(`Registration Failed! ${error.toString()}`);
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error("Registration Failed!");
    };

    const handleLoginRedirect = () => {
        message.info("Redirect to Login Page");
        // e.g., navigate("/login") if using react-router
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
                    Register
                </Title>

                <Form
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="id"
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>

                    <Text>
                        Already have an account?{" "}
                        <a href={"/login"} style={{ cursor: "pointer" }}>
                            Login
                        </a>
                    </Text>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;
