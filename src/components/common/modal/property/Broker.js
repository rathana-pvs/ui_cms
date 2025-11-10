import styles from "@/components/common/modal/dialog.module.css";
import {Button, Col, Divider, Form, Input, Popconfirm, Row, Space, Table} from "antd";
import React, {useEffect, useState} from "react";

import {nanoid} from "nanoid";
// import {getCubridBrokerConfig, restartBroker, setCubridBrokerConfig} from "@/utils/api";
import {useDispatch, useSelector} from "react-redux";
import {setLoading, setProperty} from "@/store/dialogReducer";
import {serverDisconnect} from "@/store/sharedAction";
import {extractBroker, getAPIParam} from "@/utils/utils";
import ManageBroker from "@/components/common/modal/property/ManageBroker";
import {getAllSystemParamAPI} from "@/lib/api";
// import ManageBroker from "@/components/common/modal/property/ManageBroker";

export default function (){
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [selectedKey, setSelectedKey] = useState(null);
    const [manage, setManage] = useState({open: false});
    const {property} = useSelector(state => state.dialog);
    const {servers} = useSelector(state => state.treeReducer);
    const [server, setServer] = useState({});
    const [originBroker, setOriginBroker] = useState(null);
    const [saveData, setSaveData] = useState([]);
    const [editData, setEditData] = useState([]);
    const [title, setTitle] = useState(null);
    const [brokers, setBrokers] = useState([]);
    const [draft, setDraft] = useState([]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Port",
            dataIndex: "port",
        }
    ]


    // const handleSave = async () => {
    //
    //     const extractData = {...draft}
    //     extractData["broker"] = form.getFieldsValue()
    //
    //     setDraft(extractData);
    //     await submitRequest(extractData)
    //     dispatch(setLoading(true))
    //     await restartBroker({...getAPIParam(server)})
    //     dispatch(serverDisconnect())
    //     dispatch(setLoading(false))
    //
    // };
    //
    const onEditDraft = (title, data, editData) => {
        let updateDraft = {};
        if(editData){
            for(let key in draft){
                if(key === `%${editData.name}`){
                    updateDraft[`%${title}`] = {...Object.fromEntries(data.map(res => [res.parameter, res.value])), notPersisted: true}
                }else{
                    updateDraft[key] = {...draft[key]}
                }
            }
        } else {
            updateDraft = {...draft}
            updateDraft[`%${title}`] = {...Object.fromEntries(data.map(res => [res.parameter, res.value])), notPersisted: true};

        }
        setSelectedKey(null)
        setDraft(updateDraft);
        getRefreshData(updateDraft)
    }
    //
    // const submitRequest = async (draftData) => {
    //     const finalData = getAssembleBroker(draftData)
    //     dispatch(setLoading(true))
    //     const response = await setCubridBrokerConfig({...getAPIParam(server), confdata: finalData})
    //     if (response.status) {
    //         await getRefreshApi(server)
    //         dispatch(setLoading(false))
    //     }
    // }
    //
    // const handleDelete = async () => {
    //     const object = brokers.find(res => res.key === selectedKey);
    //
    //     const data = {...draft}
    //     delete data[`%${object.name}`]
    //     setDraft(data)
    //     getRefreshData(data)
    // };


    const getRefreshApi = async (server) => {
        dispatch(setLoading(true));
        const response = await getAllSystemParamAPI(server, {confname: "cubrid_broker.conf"})
        if(response.success){
            setOriginBroker(response.result)
            const data = extractBroker(response.result)
            console.log(data)
            setDraft(data)
            getRefreshData(data)
        }
    }
    const getRefreshData = (data) => {
                const broker = data.broker
                form.setFieldsValue({
                    ...broker
                })
                setBrokers(Object.keys(data).filter(res => !["comment", "broker"].includes(res)).map(res => {
                    return {
                        key: nanoid(4),
                        name: res.replace("%", ""),
                        port: data[res]["BROKER_PORT"],
                        notPersisted: data[res]["notPersisted"]
                    }
                }))
    }
    useEffect(() => {
        if(property.open){
            const server = servers.find(res => res.serverId === property.node.serverId)
            setServer(server);
            getRefreshApi(server).then(res=>dispatch(setLoading(false)));
        }

    }, [property.open]);


    return <div className={styles.property__layout__content}>
        <Form form={form} layout="horizontal">
            <Row gutter={[0, 6]}>
                <Col span={24}>
                    <Form.Item labelCol={{span: 6}} label="MASTER_SHM_ID" name="MASTER_SHM_ID">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item labelCol={{span: 6}} label="ADMIN_LOG_FILE" name="ADMIN_LOG_FILE">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item labelCol={{span: 6}} label="ACCESS_CONTROL" name="ACCESS_CONTROL">
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item labelCol={{span: 6}} label="ACCESS_CONTROL_FILE" name="ACCESS_CONTROL_FILE">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

        </Form>

        <Divider orientation="left">Broker List</Divider>

        <Table
            className={"clickable__table"}
            columns={columns}
            dataSource={brokers}
            pagination={false}
            size="small"
            bordered

            rowClassName={(record) => {
                let classNames = ""
                if(record.key === selectedKey) {
                    classNames = classNames + " row__selected"
                }
                if(record.notPersisted) {
                    classNames = classNames + " warning"
                }
                return classNames
            }
            }
            onRow={(record) => ({
                onClick: () => {
                    setSelectedKey(record.key);
                },
            })}
        />
        <div style={{display: "flex", justifyContent: "flex-end", gap: 12, padding: "12px 0"}}>
            <Button type={"primary"} className={"button__width__80"}
                    onClick={()=>setManage({open: true, type: "add"})}>Add</Button>
            <Button disabled={!selectedKey} type={"primary"}
                    className={"button__width__80"}
                    onClick={()=>{
                        const object = brokers.find(res => res.key === selectedKey);
                        setManage({open: true, type: "edit", editData: object});
                    }}>Edit</Button>
            <Button disabled={!selectedKey}
                    // onClick={handleDelete}
                    type={"primary"} className={"button__width__80"} danger>Delete</Button>
        </div>

        <Divider style={{margin: "6px 0"}}/>

        <div style={{display: "flex", justifyContent: "flex-end", gap: 12, padding: "12px 0"}}>
            <Button type={"primary"}
                    // onClick={handleSave}
                    className={"button__width__80"}
                    >Save</Button>
            <Button type={"primary"}
                    className={"button__width__80"}
                    onClick={()=>{
                        dispatch(setProperty({open: false}))
                    }}
                    >Close</Button>
        </div>
        <ManageBroker {...manage} brokerData={draft} onSave={onEditDraft}
                      onClose={()=>setManage({...manage, open: false})} />
    </div>
}