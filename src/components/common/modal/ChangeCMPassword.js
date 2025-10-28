import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Button, Row, Col} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setChangeCMPassword, setLoading, setUserDB} from "@/state/dialogSlice";
import {createUserDB, getChangeCMPassword, getDBUser, updateUserDB} from "@/utils/api";
import {getAPIParam, isNotEmpty} from "@/utils/utils";
import {setUser} from "@/state/userSlice";
import {nanoid} from "nanoid";
import {getLocalStorage, setLocalStorage} from "@/utils/storage";

const { Option } = Select;
const { TextArea } = Input;

const CreateUserDB = () => {
    const {databases, servers} = useSelector(state=>state)
    const {changeCMPassword} = useSelector(state=>state.dialog)
    const dispatch = useDispatch();
    const [server, setServer] = useState({});
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            dispatch(setLoading(true));
            const data = {
                ...getAPIParam(server),
                targetid: server.id, oldPassword: values.oldPassword,
                newPassword: values.newPassword, hashPassword: server.password
            }
            const response = await getChangeCMPassword(data);
            dispatch(setLoading(false));
            if (response.status) {
                const connections = getLocalStorage("connections").map((item) => {
                    if(item.serverId === server.serverId) {
                        return {...item, password:response.newPassword};
                    }
                    return item
                })
                setLocalStorage("connections", connections);
                handleClose()
            }


            // if(response.status){
            //     console.log(response);
            // }

            console.log();
        })

        
    };

    const handleClose = () => {
        dispatch(setChangeCMPassword({open: false}));

    }

    



    useEffect(() => {
        if(changeCMPassword.open){
            form.resetFields()
            const server = servers.find(res=>res.serverId === changeCMPassword.node.serverId);
            setServer(server);
            form.setFieldValue("username", server.id);
            
        }
    }, [changeCMPassword]);

    

    return (
        <Modal
            title="Create User DB"
            open={changeCMPassword.open}
            onCancel={handleClose}
            onOk={handleOk}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Confirm
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <Form form={form} layout="horizontal" name={"change_password"}>
                <Row gutter={[0, 6]}>
                    <Col span={24}>
                        <Form.Item
                            name="username"
                            labelCol={{span: 7}}
                            label="Username">
                            <Input readOnly/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="oldPassword"
                            labelCol={{span: 7}}
                            label="Old Password"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="newPassword"
                            labelCol={{span: 7}}
                            label="New Password"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="confirmPassword"
                            labelCol={{span: 7}}
                            label="Confirm Password"
                            rules={[{ required: true, message: "Required" },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Passwords do not match')
                                        );
                                    },
                                })

                            ]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </Col>



                </Row>



            </Form>
        </Modal>
    );
};

export default CreateUserDB;
