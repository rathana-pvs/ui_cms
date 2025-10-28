import {Dropdown} from "antd";
import {ApiOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {nanoid} from "nanoid";

import {setLocalStorage} from "@/utils/storage";
import {useDispatch, useSelector} from "react-redux";
import {serverDisconnect} from "@/store/sharedAction";
import {setConnection, setProperty, setUnifySetting, setVersion} from "@/store/dialogReducer";
import {setServers} from "@/store/treeReducer";
import {addContents, setActivePanel} from "@/store/generalReducer";
import Dashboard from "@/components/contents/dashboard/Dashboard";
import React from "react";


export default function({node, event, open, onClose}) {
    const {servers} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const menuItems = [
        {
            label: "Disconnect Host",
            key: nanoid(4),
            icon: <ApiOutlined />,
            onClick: () => {dispatch(serverDisconnect())}
        },
        {
            label: "Add Host",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick:()=>dispatch(setConnection({open: true, type: "add"}))
        },
        {
            label: 'Edit Host',
            key: nanoid(4),
            icon: <EditOutlined />,
            onClick:()=>dispatch(setConnection({open: true, type: "edit", serverId: node.serverId}))

        },
        {
            label: 'Delete Host',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick: ()=> handleDelete()

        },
        {
            label: 'Export Connections to JDBC/CCI URL',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,

        },
        {
            label: 'Change Manager\'s Password',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,

        },
        {
            label: 'Show Host Dashboard',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick:()=>{
                dispatch(addContents(
                    {...node, label:"dashboard", children: <Dashboard/>,}
                    ))
                dispatch(setActivePanel(node.key))
            }
        },
        {
            label: 'Server Version',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick: ()=> {
                dispatch(setVersion(true))
            }
        },
        {
            label: 'Properties',
            key: nanoid(4),
            onClick: ()=> {
                dispatch(setProperty({open: true, node}))
            }

        },
        {
            label: 'Unify settings editor',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick: ()=> {
                dispatch(setUnifySetting({open: true, node}))
                //
            }

        },
    ]

    const handleDelete = ()=>{
        const connections = servers.filter(item => item.serverId !== node.serverId);
        setLocalStorage("connections", connections);
        dispatch(setServers(connections));
    }
    return (
        <Dropdown overlayStyle={{minWidth: 200}}  menu={{items: menuItems}}
                  trigger={["contextMenu"]}
                  onOpenChange={onClose}
                  open={open} placement="bottomLeft">
            <div style={{ position: "absolute", left: clientX, top: clientY, width: 0, height: 0 }} />
        </Dropdown>
    )
}
