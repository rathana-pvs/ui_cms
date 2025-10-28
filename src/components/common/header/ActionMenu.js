import {Dropdown} from "antd";
import styles from "@/components/common/header/header.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {nanoid} from "nanoid";

import CMConfig from "@/components/contents/config-param/CMConfig";
import CubridConfig from "@/components/contents/config-param/CubridConfig";
import CubridBrokerConfig from "@/components/contents/config-param/CubridBrokerConfig";
import {addContents, setActivePanel} from "@/store/generalReducer";


const CONFIG_PARAM_CONTENT = [
    {label: "Edit Cubrid Config", screen: <CubridConfig/>, key: nanoid(8)},
    {label: "Edit Broker Config", screen: <CubridBrokerConfig/>, key: nanoid(8)},
    {label: "Cubrid Manager Config", screen: <CMConfig/>, key: nanoid(8)},
]




export default function (){
    const {selectedObject, contents} = useSelector(state => state.general);
    const disabled = selectedObject.type !== "server";
    const connection = useSelector(state => state.dialog.connection);

    const dispatch = useDispatch();
    const menus = [
        {
            label: 'Show Host Dashboard',
        },
        {
            label: 'Server Version'
        },
        {
            label: 'Properties',
            disabled: !selectedObject.type,

        },
        {
            label: 'Config Params',
            disabled: !selectedObject.type,
            children: CONFIG_PARAM_CONTENT.map(param=>{
                return {...param,
                        onClick:()=>{
                            const checkObject = contents.find(item => item.key === param.key) || false
                            if(!checkObject){
                                dispatch(addContents({ ...selectedObject, ...param, children: param.screen}))
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