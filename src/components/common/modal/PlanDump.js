import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button, Input, Row, Col, Checkbox} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCopyDB, setLoading, setOptimizeDB, setPlanDump} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCopyDB, getDatabases, getDBSize, getDBSpace, getOptimizeDB, getPlanDump, getTables} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {nanoid} from "nanoid";
import {setDatabase} from "@/state/databaseSlice";

function bytesToMB(bytes) {
    if (bytes === 0) return 0;
    const mb = bytes / 1048576;
    return parseFloat(mb.toFixed(0))
}

export default function (){

    const {servers} = useSelector(state => state);
    const {planDump} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [server, setServer] = useState({});
    const [checked, setChecked] = useState(false);
    const handleOk = async () => {
        dispatch(setLoading(true));
        const response = await getPlanDump({...getAPIParam(server),
            dbname: planDump.node.title,
            plandrop: checked ? 'y' : 'n'
        });
        dispatch(setLoading(false));
        if(response.status) {
            Modal.success({
                title: 'Success',
                content: `Job Plan Dump Cache - 
                        ${planDump.node.title + "@" + server.title} has been completed successfully`,
                okText: "Close"
            })
            handleClose()
        }
    };
    useEffect(() => {
        if(planDump.open){
            const server = servers.find(server => server.serverId === planDump.node.serverId);
            setServer(server);

        }
    },[planDump])

    const handleClose = () => {
        dispatch(setPlanDump({open: false}));
    }


    return (
        <Modal
            title="Plan Cache Dump"
            open={planDump.open}
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
                    <div className={styles.db__text__title}>Database Name: {planDump.node?.title}</div>
                </div>
                <div className={styles.db__layout}>
                    <div className="border__text">Description</div>
                    <div> This utility displays current information of the parameters used in the server/client process</div>

                </div>
                <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                >
                    Drop all plans in server's cache
                </Checkbox>
            </div>
        </Modal>
    );
};

