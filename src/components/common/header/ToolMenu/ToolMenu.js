
import {Dropdown} from "antd";
import styles from "@/components/ui/header/header.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    onStartBrokers,
    onStartDatabase,
    onStartService,
    onStopBrokers, onStopDatabase,
    onStopService
} from "@/utils/utils";
import {setBrokerParser, setChangeCMPassword, setUserManagement} from "@/state/dialogSlice";
import {addContents, setActivePanel} from "@/state/generalSlice";
import SQLEditor from "@/components/ui/contents/editor/SQLEditor";
import {TOP_TOOL} from "@/utils/data";
import ServiceDashboard from "@/components/ui/contents/dashboard/ServiceDashboard";
import {nanoid} from "nanoid";




export default function (){
    const state = useSelector(state => state);
    const {selectedObject} = state.general
    const {connection} = state.dialog;
    const {subServers} = state
    const connected = selectedObject.server?.token;

    const disabled = selectedObject.type !== "server";

    const dispatch = useDispatch();
    const menus = [
        {
            label: "Start Service",
            onClick: ()=>onStartService(selectedObject, dispatch),
            disabled: disabled || !connected,
        },
        {
            label: "Stop Service",
            onClick: ()=>onStopService(selectedObject, dispatch),
            disabled: disabled || !connected
        },
        {
            label: (()=>{
                if (selectedObject.type === "database") {
                    if (selectedObject.status === "inactive")
                        return "Start Database";
                    else
                        return "Stop Database";
                }
                return "Start Database";
            })(),
            disabled: selectedObject.type !== "database",
            onClick: async () => {
                if (selectedObject.status === "active") {
                    await onStopDatabase(selectedObject, state, dispatch)
                }else {
                    await onStartDatabase(selectedObject, state, dispatch)
                }
            }
        },
        {
            label: (()=>{
                if(selectedObject.type === "brokers") {

                    if(selectedObject.status === "OFF"){
                        return "Start Brokers"
                    }else
                        return "Stop Brokers"
                }
                return "Start Broker"
            })(),
            disabled: selectedObject.type !== "brokers",
            onClick: async () => {
                if (selectedObject.status === "ON") {
                    await onStopBrokers(selectedObject, state, dispatch)
                }else{
                    await onStartBrokers(selectedObject, state, dispatch)
                }
            }
        },
        {
            label: <span>Change Password Of <b>admin</b></span>,
            onClick: ()=>{
                dispatch(setChangeCMPassword({open: true, node: selectedObject}));
            },
            disabled: !connected,
        },
        {
            label: 'User Management',
            onClick: () => dispatch(setUserManagement({open: true, type: "add"})),
            disabled: !connected,
        },
        {
            label: 'Convert Broker log to SQL',
            onClick: ()=>{
                dispatch(setBrokerParser({open: true, node: selectedObject}));
        }
        },
        {
            label: 'Convert Output of broker_log_top to excel'
        },
        {
            label: 'Service Dashboard',
            onClick: ()=>{
                let key = nanoid()
                dispatch(addContents({label: "Service Dashboard", children: <ServiceDashboard/>, key, node: selectedObject}))
                dispatch(setActivePanel(key))
            }
        },
    ];

    return (
        <Dropdown menu={{items: menus}}>
            <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                Tools
            </div>
        </Dropdown>
    )
}