import {Dropdown} from "antd";
import {
    EditOutlined,
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {useDispatch, useSelector} from "react-redux";
import {startBrokerAPI, stopBrokerAPI, stopDatabaseAPI} from "@/lib/api/cmApi";
import {setBrokers, setDatabases} from "@/store/treeReducer";
import {setLoading} from "@/store/dialogReducer";
import React from "react";
import {FolderGearIcon} from "@/components/common/icons";
// import {onStartBroker, onStopBroker} from "@/utils/utils";

export default function({node, event, open, onClose}) {
    const {activeServer, brokers} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const started = node.state === "ON";
    const menuItems = [
        {
            label: started ? "Stop Broker": "Start Broker",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: async () => {
                dispatch(setLoading(true));
                if (!started) {
                    startBrokerAPI(activeServer, {bname: node.name}).then(res => {
                        if(res.success) {
                            const newBrokers = brokers.map(res=>{
                                if(res.key === node.key){
                                    return {...res,
                                        state: "ON",
                                        icon: <FolderGearIcon status={true}/>}
                                }
                                return res;
                            })
                            dispatch(setBrokers(newBrokers));
                            dispatch(setLoading(false));

                        }
                    })
                } else {
                    stopBrokerAPI(activeServer, {bname: node.name}).then(res => {
                        if(res.success) {
                            const newBrokers = brokers.map(res=>{
                                if(res.key === node.key){
                                    return {...res,
                                        state: "OF",
                                        icon: <FolderGearIcon status={false}/>}
                                }
                                return res;
                            })
                            dispatch(setBrokers(newBrokers));
                            dispatch(setLoading(false));

                        }
                    })
                }
            },
        },
        {
            label: "status",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        },
        {
            label: "properties",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        }
    ]
    return (
        <Dropdown overlayStyle={{minWidth: 200}}  menu={{items: menuItems}}
                  trigger={["contextMenu"]}
                  onOpenChange={onClose}
                  open={open} placement="bottomLeft">
            <div style={{ position: "absolute", left: clientX, top: clientY, width: 0, height: 0 }} />
        </Dropdown>
    )
}
