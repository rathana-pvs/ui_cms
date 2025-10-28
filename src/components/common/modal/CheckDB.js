import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Checkbox, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCheckDB, setCompactDB, setLoading} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCheckDB} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";


export default function (){

    const {servers} = useSelector(state => state);
    const {checkDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const handleOk = async () => {
        const server = servers.find(server => server.serverId === checkDB.node.serverId);
        dispatch(setLoading(true));

        const response = await getCheckDB({...getAPIParam(server),
            dbname: checkDB.node.title, repairdb: checked ? "y":"n"});

        dispatch(setLoading(false));
        if(response.status){
                Modal.success({
                    title: 'Success',
                    content: `Job Check Database - 
                        ${checkDB.node.title + "@" + server.title} has been completed successfully`,
                    okText: "Close"
                })
                handleClose()
            }else{
            Modal.error({
                title: 'Error',
                content: response.note,
                okText: "Close"
            })

        }
    };

    const handleClose = () => {
        dispatch(setCheckDB({open: false}));
    }


    return (
        <Modal
            title="Check DB"
            open={checkDB.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            Check
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
                    <div className={styles.db__text__title}>Database Name: {checkDB.node?.title}</div>
                </div>
                <div className={styles.db__layout}>
                    <div className={styles.db__text__title}>Description</div>
                    <div>Verified a database. If inconsistencies are found, please contact CUBRID Support to help interpret the output and address any indicated problem so that it will not reoccur.</div>
                </div>
                <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                >
                    Repaired when inconsistent is found
                </Checkbox>
            </div>
        </Modal>
    );
};

