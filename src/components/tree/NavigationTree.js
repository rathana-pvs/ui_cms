"use client"

import React, {useEffect, useState} from 'react';
import {Modal, Tree} from 'antd';
// import axios from "axios";
// import {setToken} from "@/utils/auth";
import {getAPIParam, isNotEmpty, typeDisplay} from "@/utils/utils";
import {nanoid} from "nanoid";
import {useDispatch, useSelector} from "react-redux";

// import {
//     getAccessLog,
//     getAdminLog,
//     getBrokerLog,
//     getBrokers,
//     getDatabases,
//     getDBLog,
//     getDBUser,
//     getTables
// } from "@/utils/api";
// import ServerMenu from "@/components/common/menus/ServerMenu";
// import BrokersMenu from "@/components/common/menus/BrokersMenu";
// import BrokerMenu from "@/components/common/menus/BrokerMenu";
// import UsersMenu from "@/components/common/menus/UsersMenu";
// import UserMenu from "@/components/common/menus/UserMenu";
// import ViewSQLLog from "@/components/contents/broker/ViewSQLLog";
// import DatabaseMenu from "@/components/common/menus/DatabaseMenu";
// import {setAdminLog, setDBErrorLogs, setErrorLogs, setSubServerLogs} from "@/state/logSlicce";
// import AccessLog from "@/components/contents/log/manager/AccessLog";
// import ErrorLog from "@/components/contents/log/manager/ErrorLog";
// import BrokerErrorLog from "@/components/contents/log/broker/BrokerErrorLog";
// import ServerErrorLog from "@/components/contents/log/server/ServerErrorLog";
// import Dashboard from "@/components/contents/dashboard/Dashboard";
// import BrokersStatus from "@/components/contents/broker/BrokersStatus";
// import BrokerStatus from "@/components/contents/broker/BrokerStatus";
// import DatabasesMenu from "@/components/common/menus/DatabasesMenu";
import {
    getAdminLogFormat,
    getBrokerFormat,
    getColumnFormat,
    getDatabaseFormat,
    getErrorLogFormat,
    getFileTemplateFormat, getFolderTemplateFormat,
    getIndexFormat,
    getServerLogFolderFormat,
    getTableFormat,
    getTemplateFormat,
    getTriggerFormat,
    getUserFormat,
    getViewFormat
} from "@/utils/navigation";
import {
    setAdminLogs,
    setBrokers,
    setDatabases, setErrorLogs,
    setServers,
    setSubDatabase,
    setSubServers,
    setTables, setTriggers, setUsers,
    setViews
} from "@/store/treeReducer";
import {setToken} from "@/utils/auth";
import {
    getAdminLogAPI,
    getBrokerLogAPI,
    getBrokersAPI,
    getDatabasesAPI,
    getDBUsersAPI, getLogInfoAPI,
    getTablesAPI,
    getTriggerAPI
} from "@/api";
import {setLoginDB} from "@/store/dialogReducer";
import ServerMenu from "@/components/common/menus/ServerMenu";
import DatabasesMenu from "@/components/common/menus/DatabasesMenu";
import DatabaseMenu from "@/components/common/menus/DatabaseMenu";
import UsersMenu from "@/components/common/menus/UsersMenu";
import UserMenu from "@/components/common/menus/UserMenu";
import BrokersMenu from "@/components/common/menus/BrokersMenu";
import BrokerMenu from "@/components/common/menus/BrokerMenu";
import {addContents, setActivePanel, setSelectedObject, setTreeKey} from "@/store/generalReducer";
import Dashboard from "@/components/contents/dashboard/Dashboard";
import ViewSQLLog from "@/components/contents/broker/ViewSQLLog";
import AccessLog from "@/components/contents/log/manager/AccessLog";
import ErrorLog from "@/components/contents/log/manager/ErrorLog";
import BrokerErrorLog from "@/components/contents/log/broker/BrokerErrorLog";
import ServerErrorLog from "@/components/contents/log/server/ServerErrorLog";
import BrokersStatus from "@/components/contents/broker/BrokersStatus";
import BrokerStatus from "@/components/contents/broker/BrokerStatus";
import Button from "@/components/ui/button";


function buildTree(...dataSets) {
    const map = new Map();
    dataSets.flat().forEach(item => {
        map.set(item.key, { ...item, children: item.sub?item.sub:[] });
    });
    const tree = [];
    map.forEach((node) => {
        if (node.parentId) {
            const parent = map.get(node.parentId);
            if (parent) parent.children.push(node);
        } else {
            tree.push(node);
        }
    });
    return tree;
}

const panels = [
    {type: "server", children: <Dashboard/>, closeIcon: <i className="fa-solid fa-xmark" style={{fontSize: 13}}></i>},
    {type: "broker_log_file", children: <ViewSQLLog/>},
    {type: "manager_access_log", children: <AccessLog/>},
    {type: "manager_error_log", children: <ErrorLog/>},
    {type: "broker_error_log", children: <BrokerErrorLog/>},
    {type: "server_db_log", children: <ServerErrorLog/>},
    {type: "brokers", children: <BrokersStatus/>},
    {type: "broker", children: <BrokerStatus/>}
]

const menus = [
    {type: "server", Screen: ServerMenu},
    {type: "databases", Screen: DatabasesMenu},
    {type: "database", Screen: DatabaseMenu},
    {type: "users", Screen: UsersMenu},
    {type: "user", Screen: UserMenu},
    {type: "brokers", Screen: BrokersMenu},
    {type: "broker", Screen: BrokerMenu}
]

const App = () => {
    const {selectedObject, contents} = useSelector(state=> state.general);
    const {servers, subServers, databases, brokers,
        subDatabase, tables, views, users, triggers, adminLogs, errorLogs} = useSelector(state=> state.treeReducer);
    const dispatch = useDispatch();
    const [subLogger, setSubLogger] = useState([]);
    const [subBrokerLog, setSubBrokerLog] = useState([]);
    const [subServerLog, setSubServerLog] = useState([]);
    const [dbLogs, setDbLogs] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [menu, setMenu] = useState({});


    const handleContextMenu = (e) => {
        const {node} = e

        menus.forEach((item) => {
            if(item.type === node.type){
                setMenu({...e, Screen: item.Screen,  open: true});
            }
        })
    };
    useEffect(() => {
        setIsClient(true);
    }, []);

    const onDoubleClick = (node) => {
        panels.forEach((res) => {
            if(res.type === node.type) {
                const checkObject = contents.find(item => item.key === node.key) || false
                if(!checkObject){
                    dispatch(addContents({label: node.title,
                        ...node,
                        ...res}))
                }
                dispatch(setActivePanel(node.key))
            }
        })
    }

    const onSelect = async (keys, info) => {
        if(keys.length > 0){
            dispatch(setSelectedObject({...info.node}));
        }
    };
    const loadData = async (node) => {
        const server = servers.find(item => item.serverId === node.serverId)
        switch (node.type) {
            case "server":{
                const result = await setToken({...node})
                if (result.token) {
                    const newServers = servers.map(server => {
                        if(server.serverId === node.serverId){
                            return {...server, token: result.token, connected: true};
                        }
                        return server;
                    })
                    dispatch(setServers(newServers));
                    onDoubleClick(node)
                    dispatch(setSelectedObject(node));
                    const childData = [["Databases", "fa-database", "databases__icon"],
                        ["Brokers", "fa-folder-tree", "brokers__icon"], ["Logs", "fa-files", "logs__icon"],]

                    const newSubServer = childData.map(item => {
                        return {
                            ...getTemplateFormat(node),
                            type: item[0].toLowerCase(),
                            title: item[0],
                            icon: <i className={`fa-regular ${item[1]} ${item[2]}`}/>,
                            children: [],
                            isLeaf: false,
                        }
                    })
                    const response = await getBrokersAPI({...node, token: result.token})
                    const newBrokers = response.result.map(item =>getBrokerFormat(item, newSubServer[1]))
                    newSubServer[1].status = response.brokerstatus
                    newSubServer[1].icon = <i className={`fa-regular fa-folder-tree ${response.brokerstatus === "ON" ? "brokers__icon": "warning"}`}/>
                    dispatch(setBrokers([...brokers, ...newBrokers]))

                    dispatch(setSubServers([...subServers, ...newSubServer]))

                }else{
                    Modal.error({
                            title: "Connection Failed",
                            content: result.note,
                            okText: "Close"
                        }
                    )
                    throw new Error(result.note);
                }

                break
            }
            case "databases":{
                const response =  await getDatabasesAPI(server);
                const newDatabases = response.result.map(item => getDatabaseFormat(item, node));
                dispatch(setDatabases([...databases, ...newDatabases]));
                break;
            }

            case "broker":{
                const response =  await getBrokerLogAPI(server, {broker: node.name})

                const newBrokerLog = {
                    ...getFolderTemplateFormat(node),
                    title: "Sql Log",
                    type: "broker_folder_log",
                    sub: response.result.filter(res=>!res.type).map(item => {
                        const name = item.path?.split("/").pop()
                        return {
                            ...getFileTemplateFormat(node),
                            title: name,
                            type: "broker_log_file",
                            isLeaf: true,
                            ...item
                        }
                    }),
                }
                dispatch(setBrokers([...brokers, newBrokerLog]))

                break
            }
            case "logs":{
                const subLog = [
                    {
                        ...getTemplateFormat(node),
                        title: "Broker",
                        type: "log_broker",
                        icon: <i className="fa-regular fa-folder-tree"></i>,
                    },
                    {
                        ...getTemplateFormat(node),
                        title: "Manager",
                        type: "manager",
                        icon: <i className="fa-regular fa-computer"></i>,
                        sub: [
                            {
                                ...getFileTemplateFormat(node),
                                title: "Access Log",
                                type: "manager_access_log",
                                isLeaf:true

                            },
                            {
                                ...getTemplateFormat(node),
                                title: "Error Log",
                                type: "manager_error_log",
                                icon: <i className="fa-regular fa-file error"></i>,
                                isLeaf: true,
                            }
                        ]
                    },
                    {
                        ...getTemplateFormat(node),
                        title: "Server",
                        type: "log_server",
                        icon: <i className="fa-regular fa-server"></i>
                    }
                ]
                setSubLogger(subLog)

                const newSubBrokerLog = [
                    {
                        ...getFolderTemplateFormat(subLog[0]),
                        title: "Access Log",
                        type: "folder_access_log",
                    },
                    {
                        ...getFolderTemplateFormat(subLog[0]),
                        title: "Error Log",
                        type: "folder_error_log",
                    },
                    {
                        ...getFolderTemplateFormat(subLog[0]),
                        title: "Admin Log",
                        type: "folder_admin_log",
                        children: [],
                    }
                ]

                setSubBrokerLog(newSubBrokerLog)
                break;
            }
            case "database":{
                if(!node.isLogin){
                    dispatch(setLoginDB({open: true, type: "login", node}))
                    throw new Error("Keep loading");
                }
                break;
            }
            case "tables":{
                const server = servers.find(item => item.serverId === node.serverId)
                const database = databases.find(item => item.key === node.parentId)
                let allClass = []
                const {result} = await getTablesAPI( server,
                    {dbname: database.title }, "normal")
                allClass.push({
                    ...getFolderTemplateFormat(node),
                    title: "System Tables",
                    type: "system-table",
                    sub: result.system_class.map((item) => getTableFormat({...item, isLeaf: true}, node)),
                })
                result.user_class.forEach(item=>{
                    allClass.push(getTableFormat(item, node))
                })
                dispatch(setTables([...tables, ...allClass]))

                break;
            }
            case "views":{
                const server = servers.find(item => item.serverId === node.serverId)
                const database = databases.find(item => item.key === node.parentId)
                let allView = []
                const {result} = await getTablesAPI( server,
                    {dbname: database.title }, "view")

                allView.push({
                    ...getFolderTemplateFormat(node),
                    title: "System Views",
                    type: "system-view",
                    sub: result.system_class.map((item) => getViewFormat({...item, isLeaf: true}, node)),
                })
                result.user_class.forEach(item=>{allView.push(getViewFormat(item, node))})
                dispatch(setViews([...views, ...allView]))
                break
            }
            case "users":{
                const server = servers.find(item => item.serverId === node.serverId)
                const database = databases.find(item => item.key === node.parentId)
                const {result} = await getDBUsersAPI(server, {dbname: database.title})

                const newUser = result.map(item=>getUserFormat(item, node))
                dispatch(setUsers([...users, ...newUser]))
                break
            }
            case "triggers":{
                const server = servers.find(item => item.serverId === node.serverId)
                const database = databases.find(item => item.key === node.parentId)
                const response = await getTriggerAPI(server, {dbname: database.title})

                const newTrigger = response.result.map(item=>getTriggerFormat(item, node))
                dispatch(setTriggers([...triggers, ...newTrigger]))

                break
            }
            case "table":{
                const server = servers.find(item => item.serverId === node.serverId)
                const database = databases.find(item => item.key === node.databaseId)
                const response = await axios.post("/api/table-info",
                    {...getAPIParam(server), database: database.title, table: node.title})
                    .then(res => res.data)
                const {attribute, constraint} = response.result
                let columnIndex = []
                columnIndex.push({
                    ...getFolderTemplateFormat(node),
                    title: "Columns",
                    sub: attribute.map(item=>getColumnFormat(item, node))
                })
                columnIndex.push({
                    ...getFolderTemplateFormat(node),
                    title: "Indexes",
                    sub: constraint.map(item=>getIndexFormat(item, node))
                })
                dispatch(setColumn([...columns, ...columnIndex]))
                break
            }
            case "folder_admin_log":{
                const server = servers.find(item => item.serverId === node.serverId)
                const response = await getAdminLogAPI(server)
                const newLogs = response.result.map(item=>getAdminLogFormat(item, node))
                dispatch(setAdminLogs([...adminLogs, ...newLogs]))

                break;
            }
            case "folder_error_log":{

                let allRequest = brokers.map(item=>{
                    return getBrokerLogAPI(server, {broker: item.name})
                })
                const response = await Promise.all(allRequest)
                let newErrorLogs = []
                for(let item of response){
                    newErrorLogs.push(item.result.filter(res=>res.type === "error").map(item=>getErrorLogFormat(item, node)))
                }
                dispatch(setErrorLogs([...errorLogs, ...newErrorLogs.flat()]))
                break
            }
            case "log_server":{
                const response =  await getDatabasesAPI(server);
                const newSubServerLog = response.result.map(item=>getServerLogFolderFormat(item, node))

                setSubServerLog(newSubServerLog)
                break
            }

            case "folder_log_server":{
                const response =  await getLogInfoAPI(server, {dbname: node.title});
                const newDBErrorLogs = response.result.map(item=>(
                    {...getFileTemplateFormat(node),
                        title: item.path.split("/").pop(),
                        type: "server_db_log",
                        isLeaf: true,
                        ...item,
                    }))
                setDbLogs(newDBErrorLogs)
                break
            }

        }

    }

    const renderManu = ()=>{
        const {Screen, open, ...e} = menu
        if(Screen){
            return <Screen {...e} open={open} onClose={()=>setMenu({...menu, open: false})}/>
        }
        return null

    }
    if (!isClient) return null;
    return (
        <>
            {renderManu()}
            <Tree
                defaultExpandAll
                onRightClick={handleContextMenu}
                showLine
                showIcon
                selectedKeys={[selectedObject?.key]}
                loadData={loadData}
                onSelect={onSelect}
                switcherIcon={({expanded})=> {
                    return expanded ? <i className="fa-regular fa-square-minus" />:<i className="fa-regular fa-square-plus"/>
                }}
                titleRender={(node) => (
                    <span
                        onDoubleClick={() => onDoubleClick(node)}
                    >
                            {node.title}
                        </span>
                )}
                treeData={buildTree(servers, subServers, databases, brokers,
                    subLogger, subBrokerLog, subDatabase, tables, views,
                    users, triggers, adminLogs, errorLogs, subServerLog, dbLogs)}

            />
        </>
    );
};
export default App;