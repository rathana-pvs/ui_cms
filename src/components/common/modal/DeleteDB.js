import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Checkbox, Button, Space, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCompactDB, setDeleteDB, setLoading, setUserDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCompactDB, getDatabases, getDBSpace, getDeleteDB, loginDatabase} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {nanoid} from "nanoid";
import {form} from "framer-motion/m";
import {setDatabase} from "@/state/databaseSlice";

const columns = [
    {
        title: 'Volume Name',
        dataIndex: 'spacename',
        key: 'spacename',
    },
    {
        title: 'Volume Path',
        dataIndex: 'location',
        key: 'location',
    },
    {
        title: 'Change Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Volume Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Total Size (pages)',
        dataIndex: 'totalpage',
        key: 'totalpage',
    },
    {
        title: 'Remained Size (pages)',
        dataIndex: 'freepage',
        key: 'freepage',
    },
    {
        title: 'Volume Size (MB)',
        dataIndex: 'volumeSizeMB',
        key: 'volumeSizeMB',
    },
];
const newRow = {
    key: nanoid(4),
    spacename: '\u00A0',       // non-breaking space
    location: '\u00A0',
    date: '\u00A0',
    type: '\u00A0',
    totalpage: '\u00A0',
    freepage: '\u00A0',
    volumeSizeMB: '\u00A0',
};

export default function (){

    const {servers} = useSelector(state => state);
    const {deleteDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [info, setInfo] = useState([{}]);
    const [server, setServer] = useState({});
    const [deleteBackup, setDeleteBackup] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [form] = Form.useForm();
    const handleOk = async () => {
        form.validateFields().then( async (values) => {
            dispatch(setLoading(true))
            const response = await loginDatabase({
                ...getAPIParam(server),
                targetid: server.id,
                dbpasswd: values.password,
                dbname: deleteDB.node.title,
                dbuser: "dba",
            })
            if (response.status) {
                const deleteResponse = await getDeleteDB({
                    ...getAPIParam(server),
                    dbname: deleteDB.node.title, delbackup: deleteBackup ? 'y' : 'n'
                });
                if (deleteResponse.status) {
                    const resDatabase = await getDatabases({...getAPIParam(server)})
                    dispatch(setLoading(false))
                    if (resDatabase.status) {
                        const newDatabases = resDatabase.result.map(item => {
                            return {
                                serverId: deleteDB.node.serverId,
                                parentId: deleteDB.node.parentId,
                                title: item.dbname,
                                key: nanoid(8),
                                type: "database",
                                isLogin: false,
                                status: item.status,
                                icon: <i
                                    className={`fa-light fa-database ${item.status === "inactive" ? "warning" : "success"}`}/>,
                                ...item
                            }
                        })
                        dispatch(setDatabase(newDatabases))
                        handleClose()
                        Modal.success({
                            title: 'Success',
                            content: `Delete Database - 
                        ${deleteDB.node.title + "@" + server.title} has been completed successfully`,
                            okText: "Close"
                        })
                    }

                }
            }
            dispatch(setLoading(false))

        })


    };

    const handleClose = () => {
        dispatch(setDeleteDB({open: false}));
        setOpenConfirm(false);
    }

    useEffect(()=>{
        if(deleteDB.open){
            form.resetFields();
            const server = servers.find(server => server.serverId === deleteDB.node.serverId);
            setServer(server);
            dispatch(setLoading(true));
            getDBSpace({...getAPIParam(server), database: deleteDB.node.title}).then(res=>{
                dispatch(setLoading(false));
                if(res.status){
                    for(const spaceinfo of res.result.spaceinfo ){
                        if(spaceinfo.type === "Active_log"){
                            setInfo([{...spaceinfo, key: nanoid(4)}, newRow]);
                            break
                        }
                    }
                }
            })
        }
    },[deleteDB])

    return (
        <>
            <Modal
                width="auto"
                title="Delete DB"
                open={deleteDB.open}
                footer={() => {
                    return (
                        <>
                            <Button type="primary" onClick={()=>setOpenConfirm(true)} style={{marginRight: 8}}>
                                Delete
                            </Button>

                            <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                    onClick={handleClose}>
                                Close
                            </Button>
                        </>
                    )
                }}
            >
                <div style={{overflowY: 'auto' }}>
                    <div className={styles.db__layout}>
                        <div className={styles.db__text__title}>Database Name: {deleteDB.node?.title}</div>
                    </div>
                    <Space/>
                    <div className={styles.db__text__title}>Volume Information of Database</div>

                    <div className={styles.db__layout}>
                        <Table columns={columns} dataSource={info} bordered pagination={false} />
                    </div>
                </div>
                <Checkbox name="overwrite" checked={deleteBackup}
                          onChange={({target})=>setDeleteBackup(target.checked)}>Delete Backup Volumes</Checkbox>
            </Modal>

            <Modal
                title="Confirm Password"
                open={openConfirm}
                footer={() => {
                    return (
                        <>
                            <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                                Confirm
                            </Button>

                            <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                    onClick={handleClose}>
                                Cancel
                            </Button>
                        </>
                    )
                }}
            >
                <div style={{overflowY: 'auto' }}>
                    <div className={styles.db__layout}>
                        <Form form={form} layout="horizontal" name="confirm_password_form">
                            <Form.Item
                                name="password"
                                label="DBA Password"
                            >
                                <Input.Password/>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

