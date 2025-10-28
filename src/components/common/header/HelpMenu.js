import {Dropdown} from "antd";
import styles from "@/components/common/header/header.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setAbout, setVersion} from "@/store/dialogReducer";






export default function (){
    const selectedObject = useSelector(state => state.general.selectedObject);
    const disabled = selectedObject.type !== "server";
    const connection = useSelector(state => state.dialog.connection);
    const dispatch = useDispatch();
    const menus = [
        {
            label: 'Help',
            onClick: ()=>{
                window.open('https://www.cubrid.org/', '_blank')
            }
        },
        {
            label: 'Report Bug',
            onClick: ()=>{
                window.open("http://jira.cubrid.org/secure/Dashboard.jspa", "_blank")
            }
        },
        {
            label: 'CUBRID Online Forum',
            onClick: ()=>{
                window.open("https://www.reddit.com/r/CUBRID/", "_blank")
            }
        },
        {
            label: 'CUBRID tools developments',
            onClick: ()=>{
                window.open("https://github.com/CUBRID/cubrid-manager", "_blank")
            }
        },
        {
            label: 'Check for Updates'
        },
        {
            label: 'Server Version',
            onClick: ()=>{
                dispatch(setVersion(true))
            }
        },
        {
            label: 'About CUBRID Admin',
            onClick: ()=>{
                dispatch(setAbout(true))
            }
        },
    ]

    return (
        <Dropdown menu={{items: menus}}>
            <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                Help
            </div>
        </Dropdown>
    )
}