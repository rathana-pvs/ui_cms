import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button, Input, Row, Col, Checkbox} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCopyDB, setLoading, setOptimizeDB, setParamDump, setPlanDump} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {
    getCopyDB,
    getDatabases,
    getDBSize,
    getDBSpace,
    getOptimizeDB,
    getParamDump,
    getPlanDump,
    getTables
} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {nanoid} from "nanoid";
import {setDatabase} from "@/state/databaseSlice";


export default function (){

    const {servers} = useSelector(state => state);
    const {paramDump} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [server, setServer] = useState({});
    const handleOk = async () => {
        dispatch(setLoading(true));
        const response = await getParamDump({...getAPIParam(server), dbname: paramDump.node.title})
        dispatch(setLoading(false));
        if(response.status) {
            Modal.success({
                title: 'Success',
                content: `Job Param Dump Cache - 
                        ${paramDump.node.title + "@" + server.title} has been completed successfully`,
                okText: "Close"
            })
            handleClose()
        }
    };
    useEffect(() => {
        if(paramDump.open){
            const server = servers.find(server => server.serverId === paramDump.node.serverId);
            setServer(server);

        }
    },[paramDump])

    const handleClose = () => {
        dispatch(setParamDump({open: false}));
    }


    return (
        <Modal
            title="Param Dump"
            open={paramDump.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Dump
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Database Name: {paramDump.node?.title}</div>
                </div>
                <div className={styles.db__layout}>
                    <div className="border__text">Description</div>
                    <div> This utility is used to display information about the query plans saved (cached) on the server</div>

                </div>
                <Checkbox
                   disabled
                >
                    Dump both clint and server parameters
                </Checkbox>
            </div>
        </Modal>
    );
};

