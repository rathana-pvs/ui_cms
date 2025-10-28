import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Checkbox, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setBrokerParser, setCompactDB, setLoading, setUserDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCompactDB} from "@/utils/api";
import {extractSQL, getAPIParam, isEmptyString, isNotEmpty} from "@/utils/utils";
import TextArea from "antd/es/input/TextArea";
import {isNull} from "lodash";
import {addContents, setActivePanel} from "@/state/generalSlice";
import {TOP_TOOL, UNIFY_SETTING_CONTENT} from "@/utils/data";
import SQLEditor from "@/components/ui/contents/editor/SQLEditor";
import {nanoid} from "nanoid";


export default function (){

    const {servers} = useSelector(state => state);
    const {brokerParser} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [logs, setLogs] = useState("");

    const handleConvert = ()=>{
        if(!isEmptyString(logs)){
            const sql = extractSQL(logs);
            console.log(isNotEmpty(sql));
            if(isNotEmpty(sql)){
                let key = nanoid(8)
                dispatch(addContents({label: "SQL Editor", children: <SQLEditor/>, key, sql}))
                dispatch(setActivePanel(key))

                handleClose()
            }else{
                Modal.error({
                    title: "Error Paras",
                    content: "Invalid SQL log",
                    okText: "Close"
                })
            }
        }

    }

    const handleClose = ()=>{
        dispatch(setBrokerParser({open: false}))
    }


    return (
        <Modal
            width={800}
            title="Broker Log Parser"
            open={brokerParser.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" disabled={!logs} onClick={handleConvert} style={{marginRight: 8}}>
                            Convert
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{overflowY: 'auto' }}>
                <p>Convert the broker log(prepared statement and bind parameter) to normal SQL and set it to query editor</p>

                <TextArea
                    onChange={(e) => setLogs(e.target.value)}
                    style={{ height: 220 }}
                />
            </div>
        </Modal>
    );
};

