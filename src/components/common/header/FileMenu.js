import {setLocalStorage} from "@/utils/storage";
import {Dropdown} from "antd";
import styles from "@/components/common/header/header.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {useTranslations} from "next-intl";
import {setConnection, setExportHost, setImportHost} from "@/store/dialogReducer";
import {serverDisconnect} from "@/store/sharedAction";
import {setActivePanel, setContents, setSelectedObject} from "@/store/generalReducer";





export default function (){
    const t = useTranslations()
    const {selectedObject, contents, activePanel} = useSelector(state => state.general);
    const disabled = selectedObject.type !== "server";
    const connection = useSelector(state => state.dialog.connection);
    const dispatch = useDispatch();
    const menus = [
        {
            label: 'Add Host',
            onClick: () => dispatch(setConnection({open: true, type: "add"})),
        },
        {
            label: 'Change Host Info',
            disabled,
            onClick: () => dispatch(setConnection({open: true, type: "edit", serverId: selectedObject.serverId})),
        },
        {
            label: 'Export Host Info',
            onClick: () => dispatch(setExportHost(true)),
        },
        {
            label: 'Import Host Info',
            onClick: () => dispatch(setImportHost(true)),
        },
        {
            label: 'Disconnect Host Connection',
            disabled,
            onClick: ()=>{dispatch(serverDisconnect())}
        },
        {
            label: 'Delete Host',
            disabled,
            onClick: ()=>{
                // dispatch(deleteServer(selectedObject.id));
            }

        },
        {
            label: 'Close This Window',
            onClick: ()=>{
                const newContent = contents.filter(res=>res.key !== activePanel);
                dispatch(setContents(newContent));
                dispatch(setActivePanel(newContent.at(-1).key));
                dispatch(setSelectedObject({}))
            }
        },
        {
          label: 'Close all Windows',
            onClick: ()=>{
                dispatch(setContents([]));
                dispatch(setActivePanel(""))
                dispatch(setSelectedObject({}))
            }
        },
        {
            label: 'Import Workspace',
            disabled: true
        },
        {
            label: 'Change Workspace',
            disabled: true
        },
        {
            label: 'Basic Info',
            children: [
                {
                    label: 'Basic Info',
                    disabled: true
                },
            ]
        },
        {
            label: 'Termination'
        },
        {
            label: 'User Management'
        },
    ];

    return (
        <Dropdown menu={{items: menus}}>
            <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                {t("header.title.file")}
            </div>
        </Dropdown>
    )
}