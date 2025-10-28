import React, {useContext, useEffect, useRef, useState} from "react";
import {Modal, Form, Input, Button, Table, Select, InputNumber, Tabs} from "antd";

import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import * as Yup from 'yup';
import styles from '@/components/common/modal/dialog.module.css'
import EditableTable from "@/components/common/table/EditableTable";


const defaultBrokerParameters = [
    { key: nanoid(4), parameter: "SERVICE", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]},  value: "ON" },
    { key: nanoid(4), parameter: "BROKER_PORT", valueType: "int(1024~65535)", property: {type: "number", props: {min: 1024, max: 65535}},  value: "" },
    { key: nanoid(4), parameter: "MIN_NUM_APPL_SERVER", valueType: "int", property: {type: "number"}, value: "5" },
    { key: nanoid(4), parameter: "MAX_NUM_APPL_SERVER", valueType: "int", property: {type: "number"}, value: "40" },
    { key: nanoid(4), parameter: "APPL_SERVER_SHM_ID", valueType: "int(1024~65535)", property: {type: "number", props: {min: 1024, max: 65535}}, value: "" },
    { key: nanoid(4), parameter: "LOG_DIR", valueType: "string", property: {type: "text"}, value: "log/broker/sql_log" },
    { key: nanoid(4), parameter: "ERROR_LOG_DIR", valueType: "string", property: {type: "text"}, value: "log/broker/error_log" },
    { key: nanoid(4), parameter: "SQL_LOG", valueType: "string(ON|OFF|ERROR|NOTICE|TIMEOUT)", property: {type: "select", value: ["ON", "OFF", "ERROR", "NOTICE", "TIMEOUT"]}, value: "ON" },
    { key: nanoid(4), parameter: "TIME_TO_KILL", valueType: "int", property: {type: "number"}, value: "120" },
    { key: nanoid(4), parameter: "SESSION_TIMEOUT", valueType: "int", property: {type: "number"}, value: "300" },
    { key: nanoid(4), parameter: "KEEP_CONNECTION", valueType: "string(ON|OFF|AUTO)", property: {type: "select", value: ["ON", "OFF", "AUTO"]},  value: "AUTO" },
    { key: nanoid(4), parameter: "STATEMENT_POOLING", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "ON" },
    { key: nanoid(4), parameter: "LONG_QUERY_TIME", valueType: "int(msec)", property: {type: "number"}, value: "60000" },
    { key: nanoid(4), parameter: "LONG_TRANSACTION_TIME", valueType: "int(msec)", property: {type: "number"}, value: "60000" },
    { key: nanoid(4), parameter: "SQL_LOG_MAX_SIZE", valueType: "int", property: {type: "number"} ,value: "100000" },
    { key: nanoid(4), parameter: "LOG_BACKUP", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "OFF" },
    { key: nanoid(4), parameter: "SOURCE_ENV", valueType: "string", property: {type: "text"}, value: "cubrid.env" },
    { key: nanoid(4), parameter: "MAX_STRING_LENGTH", valueType: "int", property: {type: "number"}, value: "-1" },
    { key: nanoid(4), parameter: "ACCESS_LOG", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "ON" },
    { key: nanoid(4), parameter: "ACCESS_LIST", valueType: "string", property: {type: "text"}, value: "" },
    { key: nanoid(4), parameter: "CCI_PCONNECT", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "OFF" },
    { key: nanoid(4), parameter: "ACCESS_MODE", valueType: "string(RW|RO|SO|PHRO)", property: {type: "select", value: ["RW", "RO", "SO", "PHRO"]}, value: "RW" },
    { key: nanoid(4), parameter: "PREFERRED_HOSTS", valueType: "string", property: {type: "text"}, value: "" },
    { key: nanoid(4), parameter: "CCI_DEFAULT_AUTOCOMMIT", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "ON" },
    { key: nanoid(4), parameter: "SSL", valueType: "string(ON|OFF)", property: {type: "select", value: ["ON", "OFF"]}, value: "OFF" },
];


const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};


const InputType = ({property, ...props}) => {
    switch (property.type) {
        case "select":
            return <Select {...props}>
                {property.value.map(res=><Option key={nanoid(4)} value={res}>{res}</Option>)}
                    </Select>
        case "number":
            return <Input type={"number"} {...props} {...property.props}/>

        default:
            return <Input {...props}/>
    }
}

const EditableCell = (props) => {
    const {
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        property,
        ...restProps
    } = props;
    const form = useContext(EditableContext);
    const inputRef = useRef(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);


    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (err) {
            console.error('Save failed:', err);
        }
    };



    let childNode = children;
    const isEmpty = !children || (typeof children[0] === 'string' && children[0].trim() === '');
    if(editable){
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
            >
                <InputType property={record.property} ref={inputRef} onPressEnter={save} onBlur={save} size="small" />

            </Form.Item>
        ) : (

            <div
                onClick={() => toggleEdit()}
                style={{ minHeight: 24, padding: 0, cursor: 'pointer' }}
            >
                {isEmpty ? <span style={{ opacity: 0.4 }}>Click to edit</span> : children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};


let schema = {}

export default function ({open, type, editData,  brokerData,  onClose, onSave }) {
    const [form] = Form.useForm();
    const {servers} = useSelector(state => state.treeReducer);
    const {property} = useSelector(state => state.dialog);
    const [server, setServer] = React.useState(null);
    const [data, setData] = useState([]);
    const [isChange, setIsChange] = useState(false);
    const [configData, setConfigData] = useState([])
    const [validate, setValidate] = React.useState(false);
    const [error, setError] = React.useState("");
    const [dataSource, setDataSource] = useState([]);


    const columns = [
        {
            title: "Parameter",
            dataIndex: "parameter",
        },
        {
            title: "Value Type",
            dataIndex: "valueType",
        },
        {
            title: "Parameter Value",
            dataIndex: "value",
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'value',
                title: 'Parameter Value',
                handleSave,
            })

        }
    ]

    const handleOk = async () => {
        const data = dataSource.filter(res=>res.value);
        // const response = await setCubridBrokerConfig({...getAPIParam(server), })
        // if(response.status){
        //
        // }
        form.validateFields().then(async (values) => {
            schema.validate({...Object.fromEntries(data.map(res => [res.parameter, res.value])), name: values.bname}).then(res=>{
                onSave(values.bname, data, editData)
                onClose()
            }).catch(err=>{
                setError(err.errors)
                alertError(err.message)
            })
        })
    }

    const alertError = (message) => {
        Modal.error({
            title: "Error",
            content: message,
            okText: 'Close',
        })
    }
    useEffect(()=>{
        let exclude = ["broker"]
        if(editData){
            exclude.push(`%${editData.name}`)
        }
        const brokerPorts = Object.keys(brokerData).filter(res=>!exclude.includes(res)).map(res=>{
            return brokerData[res]["BROKER_PORT"];
        })

        const appIdList = Object.keys(brokerData).filter(res=>!exclude.includes(res)).map(res=>{
            return brokerData[res]["APPL_SERVER_SHM_ID"];
        })

        const brokerNames = Object.keys(brokerData)
        // console.log(brokerNames)
        schema = Yup.object().shape({
            name: Yup.string().required()
            .test(
                "is-duplicate",
                "Broker name is duplicated",
                function (value) {
                    return !brokerNames.includes(`%${value}`);
                }
            ),
            BROKER_PORT: Yup.number()
                .required("Broker port is required")
                .min(1024, "Broker port must be ≥ 1024")
                .max(65535, "Broker port must be ≤ 65535")
                .test(
                    "is-duplicate",
                    "Broker port is duplicated",
                    function (value) {
                        return !brokerPorts.includes(String(value));
                    }
                ),
            APPL_SERVER_SHM_ID: Yup.number()
                .required("App ID is required")
                .min(1024, "App ID must be ≥ 1024")
                .max(65535, "App ID must be ≤ 65535")
                .test(
                    "is-duplicate",
                    "App ID is duplicated",
                    function (value) {
                        return !appIdList.includes(String(value));
                    }
                )
        });
    }, [type])

    useEffect(()=>{
        form.resetFields();

        if(type === "edit"){
            const server = servers.find(res => res.serverId === property.node.serverId)
            setServer(server)
            const updateData = defaultBrokerParameters.map((res)=>{
                return {...res, value: brokerData[`%${editData.name}`][res.parameter]}
            })
            setDataSource(updateData);
            form.setFieldValue("bname", editData.name);
        }else {
            setDataSource(defaultBrokerParameters);
        }

    }, [type])

    const getValidation =()=>{
        const brokerPort = dataSource.find(res=>res.parameter === "BROKER_PORT")["value"]
        const appId = dataSource.find(res=>res.parameter === "APPL_SERVER_SHM_ID")["value"]
        return schema.validate({brokerPort, appId})
    }


    const handleSave = (row) => {
        setIsChange(true)
        const newData = dataSource.map(res=>{
            if(res.key === row.key){
                return row
            }
            return res
        })
        setDataSource(newData)
        let value = row.value
        if(row.property.type === "number")
            value = Number(row.value);

        console.log(row.parameter)
        schema.fields[row.parameter]?.validate(value).then(res=>{})

            .catch(err=>{
                setError(err.errors)
                alertError(err.message)
        })
    };
    return (
        <Modal
            style={{ maxWidth: 900, margin: "0 auto" }}
            width="100%"
            title="Broker"
            open={open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            {type === "edit" ? "Edit" : "Add"}
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => onClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >

                <div style={{maxHeight: 500, overflowY: 'auto', width:'100%'}}>



                    <Form form={form} layout="horizontal">
                        <div className={styles.db__layout}>
                            <Form.Item
                                label={"Database Name: "}
                                name={"bname"}
                                rules={[{ required: true, message: "Required" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        {/*<Table*/}
                        {/*    bordered*/}
                        {/*    pagination={false}*/}
                        {/*    dataSource={dataSource}*/}
                        {/*    columns={columns}*/}
                        {/*    components={{*/}
                        {/*        body: {*/}
                        {/*            row: EditableRow,*/}
                        {/*            cell: EditableCell,*/}
                        {/*        },*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <EditableTable columns={columns} dataSource={dataSource}/>
                    </Form>

                </div>


        </Modal>
    );
};

