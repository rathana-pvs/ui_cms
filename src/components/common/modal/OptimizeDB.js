import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setLoading, setOptimizeDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getOptimizeDB, getTables} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";


export default function (){

    const {servers} = useSelector(state => state);
    const {optimizeDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [tables, setTables] = useState([]);
    const [server, setServer] = useState({});
    const [content, setContent] = useState([]);
    const [form] = Form.useForm();

    const handleOk = async () => {
        dispatch(setLoading(true));
        const values = await form.validateFields()
        const tableName = values.table === "all"? "": values.table
        const response = await getOptimizeDB({...getAPIParam(server), dbname: optimizeDB.node.title, classname: tableName});

        dispatch(setLoading(false));
        if(response.status){
            setContent(prevState => [...prevState, `Optimize Success: ${values.table === "all" ? "All tables in database": tableName}`]);
            // Modal.success({
            //     title: 'Success',
            //     content: `Job Optimize Database -
            //             ${optimizeDB.node.title + "@" + server.title} has been completed successfully`,
            //     okText: "Close"
            // })
            // handleClose()
        }
    };


    useEffect(() => {
        if(optimizeDB.open){
            form.resetFields();
            setContent([])
            const server = servers.find(server => server.serverId === optimizeDB.node.serverId);
            setServer(server);
            dispatch(setLoading(true));
            getTables({...getAPIParam(server), database: optimizeDB.node.title, virtual: "normal"}).then(res => {
                dispatch(setLoading(false));
                if(res.status){
                    setTables(res.result.user_class)
                    form.setFieldsValue({table: "all"});
                }
            });
        }
    },[optimizeDB])

    const handleClose = () => {
        dispatch(setOptimizeDB({open: false}));
    }


    return (
        <Modal
            title="Optimize DB"
            open={optimizeDB.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Optimize
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Database Name: {optimizeDB.node?.title}</div>
                    <Form form={form} layout="horizontal" name="create_user_form">
                        <Form.Item
                            name="table"
                            label="Table Name: "
                        >
                            <Select>
                                <Option value={"all"}>All Tables</Option>
                                {tables.map((table) => (
                                    <Option key={table.id} value={table.classname}>
                                        {table.classname}
                                    </Option>
                                ))}

                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Description</div>
                    <div>The query optimizer uses statistical information such as the number of objects in a table, the number of pages to access and the distribution of attribute values.</div>
                </div>

                <div className={styles.db__content}>
                    {
                        content.map(res => (<div>{res}</div>))
                    }
                </div>
            </div>
        </Modal>
    );
};

