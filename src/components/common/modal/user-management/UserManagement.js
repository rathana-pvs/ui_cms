import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Select, Space, Table,} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {setLoading, setUserManagement} from "@/state/dialogSlice";
import {createCMUser, deleteCMUser, getCMUsers, updateCMUser} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {nanoid} from "nanoid";


const {Option} = Select;

const EditableUserTable = () => {
    const state = useSelector((state) => state);
    const {userManagement} = state.dialog
    const {selectedObject} = state.general
    const dispatch = useDispatch();

    const [selectedKey, setSelectedKey] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [users, setUsers] = useState([]);
    const [form] = Form.useForm();

    const setUserData = (data) => {
        setUsers(
            data.map((user) => ({
                targetId: user["@id"],
                dbAuth: typeof user.dbauth === 'object' ? user.dbauth?.auth_info : user.dbauth,
                casAuth: typeof user.casauth === 'object' ? user.casauth?.auth_info : user.casauth,
                statusMonitorAuth: typeof user.statusmonitorauth === 'object' ? user.statusmonitorauth?.auth_info : user.statusmonitorauth,
                key: nanoid(8),
            }))
        );
    };

    const setFormFormat = (formData)=>{
        return {
            targetid: formData.targetId,
            password: formData.password,
            casauth: formData.casAuth,
            dbcreate: formData.dbAuth,
            statusmonitorauth: formData.statusMonitorAuth,
        }
    }

    useEffect(() => {
        if(selectedObject.serverId && userManagement.open){
            dispatch(setLoading(true))
            const server = state.servers.find(res=>res.serverId === selectedObject.serverId);
            const api = getAPIParam(server)
            getCMUsers(getAPIParam(server)).then(res =>{
                dispatch(setLoading(false))
                if(res.status){
                    setUserData(res.result)
                }
            } )
        }

    },[userManagement]);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };
    const handleEdit = (record) => {
        setIsModalVisible(true);
        setEditingRecord(record);
        form.setFieldsValue({
            targetId: record.targetId,
            dbAuth: record.dbAuth,
            casAuth: record.casAuth,
            statusMonitorAuth: record.statusMonitorAuth,
            password: '',
            confirmPassword: '',
        });

    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            onOk: async () => {

                const response = await deleteCMUser({...getAPIParam(selectedObject.server), targetid: record.targetId});
                if(response.status){
                    setUsers(prev=>prev.filter(item=>item.key !== record.key));
                }
                setSelectedKey(null);
                message.success('User deleted');
            },
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            const {confirmPassword, ...userData} = values;
            if (editingRecord) {
                const response = await updateCMUser({...getAPIParam(selectedObject.server), ...setFormFormat(userData)});
                if(response.status){
                    setUserData(response.result);
                    setIsModalVisible(false);
                }
            } else {
                const server = state.servers.find(res => res.serverId === selectedObject.serverId);
                dispatch(setLoading(true))
                const response = await createCMUser({...getAPIParam(server), ...setFormFormat(userData)});
                dispatch(setLoading(false))
                if(response.status){
                    setUserData(response.result)
                    setIsModalVisible(false);
                }else{
                    Modal.success({
                        title: 'Error',
                        content: response.note,
                        okText: "Close"
                    })
                }

            }

            setSelectedKey(null);
        });
    };

    const authorityOptions = ['none', 'admin', 'monitor'].map((level) => (
        <Option key={level} value={level}>
            {level}
        </Option>
    ));

    const columns = [
        {   title: 'Username',
            dataIndex: 'targetId'
        },
        {
            title: 'DB Creation Authority',
            dataIndex: 'dbAuth',
            className: 'no-wrap',
        },
        {
            title: 'Broker Authority',
            dataIndex: 'casAuth',
            className: 'no-wrap',
        },
        {
            title: 'Status Monitor Authority',
            dataIndex: 'statusMonitorAuth',
            className: 'no-wrap',
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button danger type="link" onClick={() => handleDelete(record)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];
    const handleClose = () => {
        dispatch(setUserManagement({...userManagement, open: false}));
    }
    console.log()
    return (

        <Modal closeIcon={null}
               width="auto"
               title={"User Management"}
               maskClosable={false} open={userManagement.open}
               onOk={() => handleClose(true)}
               onCancel={() => handleClose(false)} footer={() => {
                   return (
                       <>
                           <Button type="primary" onClick={handleAdd} style={{marginRight: 8}}>
                               Add
                           </Button>
                           <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                   onClick={() => handleClose()}>
                               Close
                           </Button>
                       </>
                   )
        }} centered={true}>
            <Table
                bordered
                columns={columns}
                dataSource={users}
                pagination={false}
                rowClassName={(record) =>
                    record.key === selectedKey ? 'selected-row' : ''
                }
                onRow={(record) => ({
                    onClick: () => setSelectedKey(record.key),
                })}
            />
            <div style={{marginTop: 16, display: "flex", justifyContent: "flex-end"}}>

            </div>

            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmit}
                title={editingRecord ? 'Edit User' : 'Add User'}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        readOnly={editingRecord}
                        name="targetId"
                        label="Username"
                        rules={[{required: true, message: 'Please enter a username'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{required: !editingRecord, message: 'Please enter a password'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            {
                                required: !editingRecord,
                                message: 'Please confirm the password',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error('Passwords do not match')
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="dbAuth"
                        label="DB Creation Authority"
                        rules={[{required: true, message: 'Please select a value'}]}
                    >
                        <Select>
                            <option value={"none"}>none</option>
                            <option value={"admin"}>admin</option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="casAuth"
                        label="Broker Authority"
                        rules={[{required: true, message: 'Please select a value'}]}
                    >
                        <Select>{authorityOptions}</Select>
                    </Form.Item>

                    <Form.Item
                        name="statusMonitorAuth"
                        label="Status Monitor Authority"
                        rules={[{required: true, message: 'Please select a value'}]}
                    >
                        <Select>{authorityOptions}</Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>

    );
};

export default EditableUserTable;
