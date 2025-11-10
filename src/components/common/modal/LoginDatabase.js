import React, {memo, useEffect, useRef, useState} from 'react';
import {Button, Checkbox, Col, Form, Input, message, Modal, Row, Select, Space, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import styles from '@/components/common/modal/dialog.module.css'
import {setDatabases, setSubDatabase} from "@/store/treeReducer";
import {setLoginDB} from "@/store/dialogReducer";
import {getTemplateFormat} from "@/utils/navigation";
import {loginDatabaseAPI} from "@/lib/api";



export default function () {
    const loginDB = useSelector(state => state.dialog.loginDB);
    const {servers, databases} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [action, setAction] = useState("")



    const handleSubmit = () => {

        form.validateFields().then(async (values) => {
            const server = servers.find(res=>res.serverId === loginDB.node.serverId);
            const response = await loginDatabaseAPI(server,{
                targetid: server.id,
                dbpasswd: values.password,
                dbname: values.database,
                dbuser: values.username,
            })


            if(action === "test"){
                Modal.success({
                    title: 'Success',
                    content: "Successfully logged in",
                    okText: "Close"
                })
            }else{
                dispatch(setDatabases(databases.map(res=>{
                    if(res.key === loginDB.node.key){
                        return {...res, isLogin: true};
                    }
                    return res
                })))

                const childData = [["Tables", "fa-table-tree", "var(--color-light-green)"], ["Views", "fa-eye"],
                    ["Serials", "fa-input-numeric", {disabled: true, isLeaf:false}], ["Users", "fa-users"],
                    ["Triggers", "fa-gears"], ["Stored Procedure", "fa-table-list", {disabled: true, isLeaf: false}]]

                const newSubDatabase = childData.map(item => {
                    return {
                        ...getTemplateFormat(loginDB.node),
                        databaseId: loginDB.node.key,
                        title: item[0],
                        type: item[0].toLowerCase(),
                        icon: <i className={`fa-regular ${item[1]}`} style={{color: item[2]}} />,
                        children: [],
                        isLeaf: false,
                        ...item[2]
                    }
                })
                dispatch(setSubDatabase(newSubDatabase))
                handleClose()
            }

        })



    };

    const onAction = (name) => {
        setAction(name);
    }

    function handleClose() {
        dispatch(setLoginDB({...loginDB, open: false}));
        form.resetFields();
    }

    useEffect(()=>{
        if(loginDB.open){
            const {node} = loginDB;
            const server = servers.find(res=>res.serverId === node.serverId);
            form.setFieldsValue({
                host: server.host,
                port: "33000",
                database: node.title,
                username: "dba"
            })
        }

    },[loginDB])

    return (
        <>
            <Modal closeIcon={null} title="Database Login" maskClosable={false} open={loginDB.open} onOk={() => handleClose(true)}
                   onCancel={() => handleClose(false)} footer={null} centered={true}>

                <Form form={form} onFinish={handleSubmit} autoComplete="off" layout="vertical">
                    <Row gutter={[12, 6]}>
                        <Col span={18}>
                            <Form.Item
                                label="Host"
                                name="host"
                            >
                                <Input readOnly/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Port"
                                name="port"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Database"
                                name="database"
                            >
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="DB Username"
                                name="username"
                                rules={[{required: true, message: "Required"}]}
                            >
                                <Input placeholder="Enter DB Username"/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="DB Password"
                                name="password"
                            >
                                <Input.Password placeholder="Enter password"/>
                            </Form.Item>
                        </Col>

                        <Col span={24} style={{marginTop:24}}>
                            <Form.Item>
                                <Row align="middle" className={styles.action} gutter={[0, 0]} style={{ width: "100%" }}>

                                    <Col>
                                        <Button type={"primary"}
                                                htmlType="submit" onClick={()=>onAction("test")}>
                                            Test Connection
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type={"primary"}
                                                htmlType="submit" onClick={()=>onAction("save")}>
                                            Save
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type={"primary"} onClick={()=>handleClose()}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>


                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>

    );
};