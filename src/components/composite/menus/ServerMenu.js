import {Dropdown} from "antd";
import {ApiOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {nanoid} from "nanoid";

import {setLocalStorage} from "@/utils/storage";
import {useDispatch, useSelector} from "react-redux";
import {serverDisconnect} from "@/store/sharedAction";
import {setConnection, setProperty, setUnifySetting, setVersion} from "@/store/dialogReducer";
import {setServers} from "@/store/treeReducer";
import {addContents, setActivePanel} from "@/store/generalReducer";
import Dashboard from "@/components/composite/contents/dashboard/Dashboard";
import React from "react";
import {deleteHostAPI} from "@/lib/api/cmApi";


export default function({server, clientX, clientY, open, onClose}) {
    const {servers} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();

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
            onClick:()=>dispatch(setConnection({open: true, type: "edit", server}))
        },
        {
            label: 'Delete Host',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick: ()=> handleDelete()

        },
        {
            label: 'Change Manager\'s Password',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,

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
                // dispatch(setProperty({open: true, node}))
            }

        },
        {
            label: 'Unify settings editor',
            key: nanoid(4),
            icon: <DeleteOutlined style={{color: 'var(--danger-color)'}} />,
            onClick: ()=> {
                dispatch(setUnifySetting({open: true, server}))

            }

        },
    ]

    const handleDelete = async () => {
        const response = await deleteHostAPI(server);
        if(response.status) {
            const newServer = servers.filter(res=>res.uid !== server.uid)
            dispatch(setServers(newServer));
        }
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
