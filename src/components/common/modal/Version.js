import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";

import styles from "@/components/common/modal/dialog.module.css"

import {setVersion} from "@/store/dialogReducer";
import {getResponse} from "@/api/cmApi";


export default function (){

    const {activeServer} = useSelector(state => state.treeReducer);
    const {version} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [versionDetail, setVersionDetail] = useState({});


    const handleOk = async () => {

    };


    const handleClose = () => {
        dispatch((setVersion(false)))
    }

    useEffect(() => {
        if(version){

            getResponse(activeServer, {task:"getcmsenv"}).then(res=>{
                console.log(res);
                if(res.success){
                    setVersionDetail(res);
                }

            })
        }

    },[version])

    return (
        <Modal
            width={600}
            title="Cubrid Version"
            open={version}
            footer={() => {
                return (
                    <>
                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div style={{display: "flex", width: '100%', gap: 18}} >
                    <div className={"img__cubrid"}>
                        <img width={80} src={"https://www.cubrid.org/files/attach/images/3771164/522cf9a9415e01599545be25bfd8eab3.png"} alt={"cubrid logo"}/>
                    </div>
                    <p className={styles.db__text__title}>{versionDetail.CUBRIDVER}</p>

                </div>

            </div>
        </Modal>
    );
};

