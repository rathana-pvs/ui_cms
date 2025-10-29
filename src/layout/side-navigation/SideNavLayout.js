import React, {useState, useRef, useEffect} from "react";
import VerticalResizeLayout from "@/components/common/resizable/Resize";
import styles from "@/layout/side-navigation/SideLayout.module.css";
import {useDispatch, useSelector} from "react-redux";
import {Tabs, Tree} from "antd";
import TreeDatabase from "@/layout/side-navigation/tree-expand/TreeDatabase";
import TreeBroker from "@/layout/side-navigation/tree-expand/TreeBroker";
import {getBrokersAPI, getDatabasesAPI, getHostsAPI, revokeLogin} from "@/api/cmApi";
import {setActiveServer, setBrokers, setDatabases, setServers} from "@/store/treeReducer";
import {
    getBrokerFormat,
    getDatabaseFormat,
    getFileTemplateFormat, getFolderTemplateFormat,
    getServerFormat,
    getTemplateFormat
} from "@/utils/navigation";
import {addContents, setActivePanel} from "@/store/generalReducer";
import Dashboard from "@/components/contents/dashboard/Dashboard";
import ViewSQLLog from "@/components/contents/broker/ViewSQLLog";
import AccessLog from "@/components/contents/log/manager/AccessLog";
import ErrorLog from "@/components/contents/log/manager/ErrorLog";
import BrokerErrorLog from "@/components/contents/log/broker/BrokerErrorLog";
import ServerErrorLog from "@/components/contents/log/server/ServerErrorLog";
import BrokersStatus from "@/components/contents/broker/BrokersStatus";
import BrokerStatus from "@/components/contents/broker/BrokerStatus";
import ServerMenu from "@/components/menus/ServerMenu";
import DatabasesMenu from "@/components/menus/DatabasesMenu";
import DatabaseMenu from "@/components/menus/DatabaseMenu";
import UsersMenu from "@/components/menus/UsersMenu";
import UserMenu from "@/components/menus/UserMenu";
import BrokersMenu from "@/components/menus/BrokersMenu";
import BrokerMenu from "@/components/menus/BrokerMenu";
import {nanoid} from "nanoid";
import ServerCard from "@/components/server/ServerCard";
import {setLoading} from "@/store/dialogReducer";



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



export default function Vertical() {
    const [topHeight, setTopHeight] = useState(200);
    // const [activeServer, setActiveServer] = useState(null);
    const {contents} = useSelector(state=> state.general);
    const {user} = useSelector(state => state.auth);
    const {servers, databases, brokers, activeServer} = useSelector((state) => state.treeReducer);
    const [activeTree, setActiveTree] = useState(0)
    const [subLogger, setSubLogger] = useState([]);
    const [subBrokerLog, setSubBrokerLog] = useState([]);
    const [subServerLog, setSubServerLog] = useState([]);
    const [menu, setMenu] = useState({});
    const dispatch = useDispatch();
    const treeItems = ["DB", "Broker", "Log"]


    useEffect(() => {
        dispatch(setLoading(false));
    },[])

    useEffect(() => {;
        if(user.id){
            getHostsAPI().then(res=>{
                const newServers = res.map(item=>getServerFormat(item));
                dispatch(setServers(newServers));
            })
        }

    },[user])

    useEffect(() => {
        if(activeServer.uid){
            handleChangeServer(activeServer)
        }

    }, [activeServer.uid]);

    const handleContextMenu = (e, server) => {
        e.preventDefault();
        menus.forEach((item) => {
            if(item.type === server.type){
                setMenu({...e, server, Screen: item.Screen,  open: true});
            }
        })
    };

    const renderManu = ()=>{
        const {Screen, open, ...e} = menu
        if(Screen){
            return <Screen {...e} open={open} onClose={()=>setMenu({...menu, open: false})}/>
        }
        return null

    }

    const getTreeData = ()=>{
        if(activeTree === 0){
            return buildTree(databases)
        }else if(activeTree === 1){
            return buildTree(brokers)
        }else if(activeTree === 2){
            console.log(buildTree(subLogger, subBrokerLog))
            return buildTree(subLogger, subBrokerLog)
        }
    }
    const getServerSection = ()=>{
        if(activeServer.uid){
            return (
                <div className={styles.tree__layout}>
                    <div className={styles.tree__alias}>
                        {activeServer.alias}
                    </div>
                    <div className={styles.tree__item__layout}>

                        {treeItems.map((res, index)=> {
                            return <div onClick={()=>setActiveTree(index)} key={index}
                                        className={`${styles.tree__item} ${activeTree === index ?
                                            styles.tree__item__active: ""}`}>{treeItems[index]}</div>
                        })}

                    </div>
                    <div className={styles.nav__tree}>
                        <Tree
                            defaultExpandAll
                            showLine
                            showIcon
                            // selectedKeys={[selectedObject?.key]}
                            // loadData={loadData}
                            // onSelect={onSelect}
                            switcherIcon={({expanded})=> {
                                return expanded ? <i className="fa-regular fa-square-minus" />:<i className="fa-regular fa-square-plus"/>
                            }}
                            treeData={getTreeData()}

                        />
                        {/*<Tabs*/}
                        {/*    activeKey={activeTree}*/}
                        {/*    items={tree}*/}
                        {/*    tabBarStyle={{ display: "none" }}*/}
                        {/*/>*/}
                    </div>

                </div>
            )
        }

        return null
    }

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

   const handleChangeServer = async (server) => {
       const response = await revokeLogin(server)
       if(response){
           getDatabasesAPI(activeServer).then(res=>{
               if(res.success){
                   const newDatabases = res.result?.map(item => getDatabaseFormat(item));
                   dispatch(setDatabases(newDatabases));
               }
           })
           getBrokersAPI(activeServer).then(res=>{
               const newBrokers = res.result?.map(item => getBrokerFormat(item));
               dispatch(setBrokers(newBrokers))
           })

           const subLog = [
               {
                   // ...getTemplateFormat(activeServer),
                   key: nanoid(4),
                   title: "Broker",
                   type: "log_broker",
                   icon: <i className="fa-regular fa-folder-tree"></i>,
               },
               {
                   key: nanoid(4),
                   title: "Manager",
                   type: "manager",
                   icon: <i className="fa-regular fa-computer"></i>,
                   sub: [
                       {
                           key: nanoid(4),
                           title: "Access Log",
                           type: "manager_access_log",
                           isLeaf:true

                       },
                       {
                           key: nanoid(4),
                           title: "Error Log",
                           type: "manager_error_log",
                           icon: <i className="fa-regular fa-file error"></i>,
                           isLeaf: true,
                       }
                   ]
               },
               {
                   key: nanoid(4),
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
       }

   }
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            {renderManu()}
            <div
                style={{
                    height: topHeight,
                }}
                className={styles.tree__host}
            >
                {
                    // servers.map(server =>{
                    //     return <div
                    //             className={`${styles.host__item} ${server.uid === activeServer.uid ? styles.host__active : ""}`}
                    //         key={server.key} onClick={()=>{
                    //             dispatch(setActiveServer(server))
                    //             onDoubleClick(server)
                    //     }}
                    //             onContextMenu={(e)=>handleContextMenu(e, server)}
                    //     >
                    //         {server.alias}</div>
                    // })
                    servers.map(server=>{
                        const {key, ...restProps} = server
                        return <ServerCard key={key} {...restProps}
                                           status={server.uid === activeServer.uid}
                                           onClick={()=> {
                                               dispatch(setActiveServer(server))
                                               onDoubleClick(server)
                                           }}
                                           onContextMenu={(e)=>handleContextMenu(e, server)}
                        />
                    })
                }
            </div>
           <VerticalResizeLayout onChangeHeight={(newHeight)=>setTopHeight(newHeight)} />
            {getServerSection()}
        </div>
    );
}
