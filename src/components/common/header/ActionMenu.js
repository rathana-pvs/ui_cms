import {Dropdown} from "antd";
import styles from "@/components/common/header/header.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {nanoid} from "nanoid";

import CMConfig from "@/components/composite/contents/config-param/CMConfig";
import CubridConfig from "@/components/composite/contents/config-param/CubridConfig";
import CubridBrokerConfig from "@/components/composite/contents/config-param/CubridBrokerConfig";
import {addContents, setActivePanel} from "@/store/generalReducer";
import {setDashboardConfig, setVersion} from "@/store/dialogReducer";


const CONFIG_PARAM_CONTENT = [
    {label: "Edit Cubrid Config", screen: CubridConfig, key: nanoid(8)},
    {label: "Edit Broker Config", screen: CubridBrokerConfig, key: nanoid(8)},
    {label: "Cubrid Manager Config", screen: CMConfig, key: nanoid(8)},
]




export default function (){
    const {contents} = useSelector(state => state.general);
    const {activeServer} = useSelector(state => state.treeReducer);
    const disabled = activeServer.type !== "server";
    const connection = useSelector(state => state.dialog.connection);

    const dispatch = useDispatch();
    const menus = [
        {
            label: 'Show Host Dashboard',
        },
        {
            label: 'Dashboard Config',
            onClick: ()=>{
                dispatch(setDashboardConfig({open: true, server: activeServer}));
            }
        },
        {
            label: 'Server Version',
            onClick: ()=> {
                dispatch(setVersion(true))
            }
        },
        {
            label: 'Properties',
            disabled: !activeServer.type,

        },
        {
            label: 'Config Params',
            disabled: !activeServer.type,
            children: CONFIG_PARAM_CONTENT.map(param=>{
                return {...param,
                        onClick:()=>{
                            const checkObject = contents.find(item => item.key === param.key) || false
                            if(!checkObject){
                                dispatch(addContents({ ...activeServer, ...param, children: param.screen}))
                            }
                            dispatch(setActivePanel(param.key))
                        }
                };
            })
        },

    ];

    return (
        <Dropdown menu={{items: menus}}>
            <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                Action
            </div>
        </Dropdown>
    )
}