import React, {useEffect, useState} from "react";
import {Form, Input, InputNumber, Modal, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setDashboardConfig, setLoading} from "@/store/dialogReducer";
import {getIntervalDashboard, setIntervalDashboard} from "@/preference/pref";
const { Option } = Select;

const { TextArea } = Input;

const DashboardConfig = () => {
    const {dashboardConfig} = useSelector(state=>state.dialog)
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const handleSave = () => {
        let value = form.getFieldValue("interval")
        if(parseInt(value)){
            value = 0
        }
        setIntervalDashboard(value)
        handleClose()

    }
    const handleClose = () => {
        dispatch(setDashboardConfig({open: false}))
    }
    useEffect(() => {
        if(dashboardConfig.open){
            const values = getIntervalDashboard();
            if(values){
                form.setFieldValue("interval", values);
            }
        }

    },[dashboardConfig.open])


    return (
        <Modal
            width={400}
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
                    label="Interval (seconds), 0 is no refresh"


                >
                    <Input
                        type="number"
                        precision={0}           // <-- integers only
                        style={{ width: "100%" }}
                        min={0}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DashboardConfig;
