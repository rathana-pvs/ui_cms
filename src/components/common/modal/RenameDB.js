import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button, Input, Row, Col, Checkbox} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCopyDB, setLoading, setOptimizeDB, setRenameDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCopyDB, getDatabases, getDBSize, getDBSpace, getOptimizeDB, getRenameDB, getTables} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {nanoid} from "nanoid";
import {setDatabase} from "@/state/databaseSlice";

export default function (){

    const {servers} = useSelector(state => state);
    const {renameDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [server, setServer] = useState({});
    const [form] = Form.useForm();
    const handleOk = async () => {
        console.log(form)
        form.validateFields().then(async (values) => {
            dispatch(setLoading(true));
            const data = {...getAPIParam(server),
                ...values,
                rename: values.dbname,
                dbname: renameDB.node.title,
                advanced: "off", forcedel: values.forcedel ? "y" : "n"}
            const response = await getRenameDB(data);
            if(response.status){
                const resDatabase = await getDatabases({...getAPIParam(server)})
                dispatch(setLoading(false));
                if(resDatabase.status){
                    const newDatabases = resDatabase.result.map(item=>{
                        return {
                            serverId: renameDB.node.serverId,
                            parentId: renameDB.node.parentId,
                            title: item.dbname,
                            key: nanoid(8),
                            type: "database",
                            isLogin: false,
                            status: item.status,
                            icon: <i className={`fa-light fa-database ${item.status === "inactive" ? "warning" : "success"}`}/>,
                            ...item
                        }
                    })
                    dispatch(setDatabase(newDatabases))
                    Modal.success({
                        title: 'Success',
                        content: `Job Rename Database - 
                        ${renameDB.node.title + "@" + server.title} has been completed successfully`,
                        okText: "Close"
                    })
                }

                handleClose()
            }else{
                dispatch(setLoading(false));
            }
        })
    };


    useEffect(() => {
        if(renameDB.open){
            form.resetFields();
            const server = servers.find(server => server.serverId === renameDB.node.serverId);
            setServer(server);
            form.setFieldValue("dbname", renameDB.node.title);
            form.setFieldValue("exvolpath", renameDB.node.dbdir);

        }
    },[renameDB])

    const handleClose = () => {
        dispatch(setRenameDB({open: false}));
    }


    return (
        <Modal
            title="Rename DB"
            open={renameDB.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Rename
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Form form={form} layout="horizontal">
                    <div className={styles.db__layout}>
                        <Row gutter={[12, 6]}>
                            <Col span={24}>
                                <Form.Item
                                    name="dbname"
                                    labelCol={{span: 6}}
                                    label="Database Name">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="exvolpath"
                                    labelCol={{span: 6}}
                                    label="External Volume Path">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={24}>
                            <Checkbox name="forcedel"> Force Delete Backup Volume </Checkbox>
                            <br/>

                        </Col>
                    </Row>

                </Form>
            </div>
        </Modal>
    );
};

