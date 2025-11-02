import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setDashboardConfig, setLoading} from "@/store/dialogReducer";
import {getIntervalDashboard, setIntervalDashboard} from "@/preference/pref";
const { Option } = Select;

const { TextArea } = Input;

const DashboardConfig = () => {
    const {databases, users, servers} = useSelector(state=>state)
    const {dashboardConfig} = useSelector(state=>state.dialog)
    const [database, setDatabase] = useState({})
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const {server} = dashboardConfig;
    const handleSave = () => {
        setIntervalDashboard(server, form.getFieldValue("interval"))
        handleClose()
    }
    const handleClose = () => {
        dispatch(setDashboardConfig({open: false}))
    }
    useEffect(() => {
        if(dashboardConfig.open){
            const values = getIntervalDashboard();
            if(values){
                form.setFieldValue("interval", values[server.uid]);
            }
        }

    },[dashboardConfig.open])

    return (
        <Modal
            title="Dashboard Config"
            open={dashboardConfig.open}
            onCancel={handleClose}
            onOk={handleSave}
            okText="Save"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="interval"
                    label="Interval (seconds)"
                >
                    <Input type="number"/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DashboardConfig;
