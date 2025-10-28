import React, {useEffect, useState} from "react";
import { Modal, Form, Input, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setLoading, setUserDB} from "@/state/dialogSlice";
import {createUserDB, getDBUser, updateUserDB} from "@/utils/api";
import {getAPIParam, isNotEmpty} from "@/utils/utils";
import {setUser} from "@/state/userSlice";
import {nanoid} from "nanoid";

const { Option } = Select;
const { TextArea } = Input;

const CreateUserDB = () => {
    const {databases, users, servers} = useSelector(state=>state)
    const {userDB, loginDB} = useSelector(state=>state.dialog)
    const [database, setDatabase] = useState({})
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const handleOk = () => {
        const server = servers.find(res=>res.serverId === userDB.node.serverId);
        form.validateFields()
            .then(async (values) => {
                dispatch(setLoading(true))
                let response = {}
                const data = {...getAPIParam(server), ...values, groups: values.groups}

                if (userDB.type === "add") {
                    response = await createUserDB(data)
                } else {
                    response = await updateUserDB(data);
                }

                if (response.status) {
                    updateUsers(server, database).then(() => {
                        handleClose()
                    })
                } else {
                    Modal.error({
                        title: 'Error',
                        content: response.note,
                        okText: "Close"
                    })
                }

            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleClose = () => {
        dispatch(setUserDB({open: false}));
    }

    const updateUsers = async (server, db) => {
        dispatch(setLoading(true))
        const responseUsers = await getDBUser({...getAPIParam(server), database: db.title})
        dispatch(setLoading(false))
        if (responseUsers.status) {
            const oldUsers = users.filter(item => item.databaseId !== db.key)
            const newUsers = responseUsers.result.map(res => {
                const parentId = userDB.type === "add" ? userDB.node.key : userDB.node.parentId
                return {
                    serverId: userDB.node.serverId,
                    parentId: parentId,
                    databaseId: db.key,
                    title: res["@name"],
                    key: `${parentId}-${nanoid(8)}`,
                    type: "user",
                    icon: <i className="fa-light fa-user success"/>,
                    isLeaf: true,
                    ...res
                }
            })
            dispatch(setUser([...oldUsers, ...newUsers]))
        }
    }




    useEffect(() => {
        if(userDB.open){
            form.resetFields()
            const server = servers.find(res=>res.serverId === userDB.node.serverId);
            const db = databases.find(res=>res.key === userDB.node.databaseId)
            setDatabase(db)
            updateUsers(server, db).then(()=>{
                form.setFieldsValue({
                    dbname: db.title,
                })
                if(userDB.type === "edit"){
                    console.log(userDB.node.groups)
                    form.setFieldsValue({
                        username: userDB.node.title,
                        groups: isNotEmpty(userDB.node.groups)? userDB.node.groups[0].group: [],
                    })
                }
            })
        }
    }, [userDB]);

    const getRenderGroups = ()=>{
        return users.filter(res=>{
            if(res.databaseId === database.key){
                if(userDB.type === "edit"){
                    return res.title !== userDB.node.title
                }
                return true
            }
            return false
        }).map(res=>(
            <Option key={res.key} value={res.title}>
                {res.title}
            </Option>
        ))
    }

    return (
        <Modal
            title="Create User DB"
            open={userDB.open}
            onCancel={handleClose}
            onOk={handleOk}
            okText="Create"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="create_user_form">
                <Form.Item
                    name="dbname"
                    label="Database"
                >
                    <Select placeholder="Select a database" open={false}>
                        {databases.map((db) => (
                            <Option key={db.key} value={db.title}>
                                {db.title}
                            </Option>
                        ))}
                        {/*<Option value={loginDB.node?.title}>{loginDB.node?.title}</Option>*/}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: "Please enter a username" }]}
                >
                    <Input placeholder="Enter username" readOnly={userDB.type === "edit"}/>
                </Form.Item>

                <Form.Item
                    name="userpass"
                    label="Password"
                    rules={[{ required: false, message: "Please enter a password" }]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["userpass"]}
                    hasFeedback
                    rules={[
                        { required: false, message: "Please confirm the password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("userpass") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("The two passwords do not match!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Re-enter password" />
                </Form.Item>

                <Form.Item name="memo" label="Memo">
                    <TextArea rows={3} placeholder="Optional memo" />
                </Form.Item>

                <Form.Item name="groups" label="Groups">
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select user groups"
                    >
                        {
                           getRenderGroups()
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUserDB;
