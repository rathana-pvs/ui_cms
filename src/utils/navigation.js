import {nanoid} from "nanoid";
import React from "react";
import {typeDisplay} from "@/utils/utils";
import {FolderGearIcon, FolderIcon} from "@/components/common/icons";

export const getTemplateFormat = (node)=>{
    return {
        // serverId: node.serverId,
        parentId: node.key,
        key: nanoid(4)
    }
}

export const getFileTemplateFormat = (node)=>{
    return {
        ...getTemplateFormat(node),
        icon: <i className="fa-regular fa-file"/>,
    }
}

export const getFolderTemplateFormat = (node)=>{
    return {
        ...getTemplateFormat(node),
        icon: <FolderIcon/>,
    }
}

export const getServerFormat =(server)=>{

    return {
        ...server,
        key: nanoid(4),
        serverId: nanoid(4),
        title: server.alias,
        type: "server",
        icon: <i className="fa-regular fa-server success server__icon"/>,
        isLeaf: false,
    }
}

export const getDatabaseFormat =(item)=>{
    console.log(item)
    return {
        ...item,
        // ...getTemplateFormat(node),
        key: nanoid(4),
        title: item.dbname,
        type: "database",
        isLogin: false,
        icon: <i className={`fa-regular fa-database ${item.status === "inactive" ? "warning" : "success"}`}/>,

    }
}

export const getBrokerFormat =(item, node)=>{
    return {
        // ...getTemplateFormat(node),
        key: nanoid(4),
        title: `${item.name} (${item.port})`,
        icon: <FolderGearIcon status={item.state === "ON"}/>,
        ...item,
        type: "broker"
    }
}

export const getTableFormat =(table, node)=>{
    return {
        ...getTemplateFormat(node),
        title: table.classname,
        type: "table",
        icon: <i className="fa-regular fa-table" style={{color: "var(--color-light-blue)"}}/>,
        ...table
    }
}

export const getViewFormat =(view, node)=>{
    return {
        ...getTemplateFormat(node),
        title: view.classname,
        type: "view",
        icon: <i className="fa-regular fa-eye" style={{color: "var(--color-purple)"}}/>,
        ...view
    }
}

export const getUserFormat =(item, node)=>{
    return {
        ...getTemplateFormat(node),

        title: item["@name"],
        type: "user",
        icon: <i className="fa-regular fa-user success"/>,
        isLeaf: true,
        ...item
    }
}

export const getTriggerFormat = (item, node)=>{
    return {
        ...getTemplateFormat(node),
        databaseId: node.parentId,
        title: `${item.name}`,
        type: "trigger",
        icon: <i className="fa-regular fa-gear-code"></i>,
        isLeaf: true,
        ...item
    }
}

export const getColumnFormat =(item, node)=>{
    return {
        ...getTemplateFormat(node),
        databaseId: node.databaseId,
        title: `${item.name} (${typeDisplay(item.type)})`,
        type: "column",
        icon: <i className="fa-regular fa-columns-3"/>,
        isLeaf: true,
        ...item
    }
}

export const getIndexFormat =(item, node)=>{
    return {
        ...getTemplateFormat(node),
        databaseId: node.databaseId,
        title: item.name,
        type: "index",
        icon: <i className="fa-regular fa-columns-3"/>,
        isLeaf: true,
        ...item
    }
}

export const getAdminLogFormat =(item, node)=>{
    return {
        ...getTemplateFormat(node),
        title: `${item.path?.split("/").pop()}`,
        icon: <i className="fa-regular fa-file"></i>,
        isLeaf: true

    }
}

export const getErrorLogFormat =(item, node)=>{
    return {
        ...item,
        ...getTemplateFormat(node),
        title: item.path?.split("/").pop(),
        type: "broker_error_log",
        icon: <i className="fa-regular fa-file"></i>,
        isLeaf: true

    }
}

export const getServerLogFolderFormat =(item, node)=>{
    return {
        ...getTemplateFormat(node),
        title: item.dbname,
        type: "folder_log_server",
        icon: <i className="fa-solid fa-folder icon__folder"></i>,
        isLeaf: false,
        ...item
    }
}