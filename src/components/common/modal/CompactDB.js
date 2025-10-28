import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Checkbox, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCompactDB, setLoading, setUserDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCompactDB} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";


export default function (){

    const {servers} = useSelector(state => state);
    const {compactDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [content, setContent] = useState(null);
    const handleOk = async () => {
        const server = servers.find(server => server.serverId === compactDB.node.serverId);
        dispatch(setLoading(true));

        const response = await getCompactDB({...getAPIParam(server),
            dbname: compactDB.node.title, verbose: checked ? "y":"n"});

        dispatch(setLoading(false));
            if(response.status){
                if(checked){
                    setContent(response.result);
                }else{
                    Modal.success({
                        title: 'Success',
                        content: `Job Compact Database - 
                        ${compactDB.node.title + "@" + server.title} has been completed successfully`,
                        okText: "Close"
                    })
                    handleClose()
                }

            }
    };

    const handleClose = () => {
        dispatch(setCompactDB({open: false}));
    }

    useEffect(()=>{
        if(compactDB.open){
            setContent(null)
        }
    },[compactDB])

    const renderDescription = ()=>{
        return (
            <div>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Database Name: {compactDB.node?.title}</div>
                    <Checkbox
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    >
                        Show Verbose Status Message
                    </Checkbox>
                </div>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Description</div>
                    <div>This utility reclaim from two source</div>

                    <br/>
                    <div>- OID of deleted object</div>
                    <div>- multiple table representations</div>

                </div>
            </div>
        )
    }

    const renderResponse = () => {
        return (
            <div className={styles.compact__db__content}>
                {content.map(res=>(
                    <div>{res}</div>
                ))}
            </div>
        )
    }

    return (
        <Modal
            title="Compact DB"
            open={compactDB.open}
            footer={() => {
                return (
                    <>
                        {!content?<Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Compact
                        </Button>:null}

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {content?renderResponse():renderDescription()}
            </div>
        </Modal>
    );
};

