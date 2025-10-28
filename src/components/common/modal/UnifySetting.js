import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Checkbox, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCompactDB, setLoading, setUnifySetting, setUserDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {getCompactDB} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {UNIFY_SETTING_CONTENT} from "@/utils/data";
import {addContents} from "@/state/generalSlice";

const defaultCheckBox = {
    cubridConfig: false,
    brokerConfig: false,
    CMConfig: false,
}
export default function (){

    const {servers} = useSelector(state => state);
    const {unifySetting} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [checkbox, setCheckbox] = useState(defaultCheckBox);

    const handleOk = ()=>{
        if(checkbox.cubridConfig){
            dispatch(addContents({ ...unifySetting.node, ...UNIFY_SETTING_CONTENT[0], children: UNIFY_SETTING_CONTENT[0].screen}))
        }
        if(checkbox.brokerConfig){
            dispatch(addContents({ ...unifySetting.node, ...UNIFY_SETTING_CONTENT[1], children: UNIFY_SETTING_CONTENT[1].screen}))
        }
        if(checkbox.CMConfig){
            dispatch(addContents({ ...unifySetting.node, ...UNIFY_SETTING_CONTENT[2], children: UNIFY_SETTING_CONTENT[2].screen}))
        }
        handleClose()
        setCheckbox(defaultCheckBox);
    }

    const handleClose = () => {
        dispatch(setUnifySetting({open: false}));
    }

    const handleCheckBox = (e)=>{
        const {name, checked} = e.target;
        setCheckbox(prevState => ({...prevState, [name]: checked}));
    }




    return (
        <Modal
            title="Unify Setting"
            open={unifySetting.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={handleOk} style={{marginRight: 8}}>
                            OK
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
                <Checkbox name={"cubridConfig"} value={checkbox.cubridConfig}
                onClick={handleCheckBox}
                >Edit Cubrid Config</Checkbox>
                <br/>
                <Checkbox name={"brokerConfig"} value={checkbox.brokerConfig}
                onClick={handleCheckBox}
                >Edit Broker Config</Checkbox>
                <br/>
                <Checkbox name={"CMConfig"} value={checkbox.CMConfig}
                onClick={handleCheckBox}
                >Edit CM Config</Checkbox>
            </div>
        </Modal>
    );
};

