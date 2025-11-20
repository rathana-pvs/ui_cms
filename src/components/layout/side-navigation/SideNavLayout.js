import React, {useState, useRef, useEffect} from "react";
import VerticalResizeLayout from "@/components/common/resizable/Resize";
import styles from "@/components/layout/side-navigation/SideLayout.module.css";
import {useDispatch, useSelector} from "react-redux";
import {Tabs, Tree} from "antd";
import TreeDatabase from "@/components/layout/side-navigation/tree-expand/TreeDatabase";
import TreeBroker from "@/components/layout/side-navigation/tree-expand/TreeBroker";
import {getBrokersAPI, getDatabasesAPI, getDBSpaceAPI, getDBUsersAPI, getHostsAPI, revokeLogin} from "@/lib/api/cmApi";
import {setActiveServer, setBrokers, setDatabases, setServers, setUsers} from "@/store/treeReducer";
import {
    getBrokerFormat,
    getDatabaseFormat,
    getFileTemplateFormat, getFolderTemplateFormat,
    getServerFormat,
    getTemplateFormat, getUserFormat
} from "@/utils/navigation";
import {addContents, setActivePanel} from "@/store/generalReducer";
import Dashboard from "@/components/composite/contents/dashboard/Dashboard";
import ViewSQLLog from "@/components/composite/contents/broker/ViewSQLLog";
import AccessLog from "@/components/composite/contents/log/manager/AccessLog";
import ErrorLog from "@/components/composite/contents/log/manager/ErrorLog";
import BrokerErrorLog from "@/components/composite/contents/log/broker/BrokerErrorLog";
import ServerErrorLog from "@/components/composite/contents/log/server/ServerErrorLog";
import BrokersStatus from "@/components/composite/contents/broker/BrokersStatus";
import BrokerStatus from "@/components/composite/contents/broker/BrokerStatus";
import ServerMenu from "@/components/composite/menus/ServerMenu";
import DatabasesMenu from "@/components/composite/menus/DatabasesMenu";
import DatabaseMenu from "@/components/composite/menus/DatabaseMenu";
import UsersMenu from "@/components/composite/menus/UsersMenu";
import UserMenu from "@/components/composite/menus/UserMenu";
import BrokersMenu from "@/components/composite/menus/BrokersMenu";
import BrokerMenu from "@/components/composite/menus/BrokerMenu";
import {nanoid} from "nanoid";
import ServerCard from "@/components/composite/server/ServerCard";
import {setLoading} from "@/store/dialogReducer";
import {FileIcon, FolderIcon} from "@/components/common/icons";
import VolumeSpace from "@/components/composite/contents/space-db/VolumeSpace";





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
    {type: "server", children: Dashboard, closeIcon: <i className="fa-solid fa-xmark" style={{fontSize: 13}}></i>},
    {type: "broker_log_file", children: ViewSQLLog},
    {type: "manager_access_log", children: AccessLog},
    {type: "manager_error_log", children: ErrorLog},
    {type: "broker_error_log", children: BrokerErrorLog},
    {type: "server_db_log", children: ServerErrorLog},
    {type: "brokers", children: BrokersStatus},
    {type: "broker", children: BrokerStatus},
    {type: "Volume info", children: VolumeSpace},
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
    const {servers, databases, brokers, users, activeServer} = useSelector((state) => state.treeReducer);
    const [activeTree, setActiveTree] = useState(0)
    const [subLogger, setSubLogger] = useState([]);
    const [subBrokerLog, setSubBrokerLog] = useState([]);
    const [subServerLog, setSubServerLog] = useState([]);
    const [menu, setMenu] = useState({});
    const dispatch = useDispatch();
    const treeItems = ["DB", "Broker", "Log"]
    const [subDatabase, setSubDatabase] = useState([]);
    const [subDBSpace, setSubDBSpace] = useState([]);
    const [spaceTreeFolder, setSpaceTreeFolder] = useState([])

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

    const handleTreeRightClick = (e)=>{
        const {node} = e;
        menus.forEach((item) => {
            if(item.type === node.type){
                setMenu({...e, node, Screen: item.Screen,  open: true});
            }
        })
    }

    const renderManu = ()=>{
        const {Screen, open, ...e} = menu
        if(Screen){
            return <Screen {...e} open={open} onClose={()=>setMenu({...menu, open: false})}/>
        }
        return null

    }

    const getTreeData = ()=>{
        if(activeTree === 0){
            return buildTree(databases, subDatabase, users, subDBSpace, spaceTreeFolder)
        }else if(activeTree === 1){
            return buildTree(brokers)
        }else if(activeTree === 2){
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
                            onRightClick={handleTreeRightClick}
                            // selectedKeys={[selectedObject?.key]}
                            loadData={onLoadData}
                            // onSelect={onSelect}
                            switcherIcon={({expanded})=> {
                                return expanded ? <i className="fa-regular fa-square-minus" />:<i className="fa-regular fa-square-plus"/>
                            }}
                            treeData={getTreeData()}
                            titleRender={(node) => (
                                <span
                                    onDoubleClick={() => onDoubleClick(node)}
                                >
                            {node.title}
                        </span>
                            )}

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
                   const newSubDataBase = newDatabases.map(db=>{

                       return [
                           {
                               ...getTemplateFormat(db),
                               title: "Users",
                               type: "users",
                               isLeaf: false,
                               icon: <i className="fa-regular fa-users"></i>
                           },
                           {
                               ...getTemplateFormat(db),
                               title: "Job Automation",
                               icon: <i className="fa-regular fa-clock"></i>,
                               sub: [
                                   {
                                       title: "Backup Plan",
                                       key: nanoid(4),
                                       icon: <FolderIcon/>
                                   },
                                   {
                                       title: "Query Plan",
                                       key: nanoid(4),
                                       icon: <FolderIcon/>
                                   }
                               ]
                           },
                           {
                               ...getTemplateFormat(db),
                               title: "Database Space",
                               type: "dbspace",
                               icon: <i className="fa-regular fa-server"></i>,
                               isLeaf: false
                           }
                       ]
                   })
                   setSubDatabase(newSubDataBase.flat())

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

   const onLoadData = async (node) => {
       switch (node.type) {
           case "users": {

               const database = databases.find(item => item.key === node.parentId)
               const {result} = await getDBUsersAPI(activeServer, {dbname: database.title})
               const newUser = result.map(item => getUserFormat(item, node))
               dispatch(setUsers([...users, ...newUser]))
               break;
           }
           case "dbspace": {
               const database = databases.find(item => item.key === node.parentId)
               const {result} = await getDBSpaceAPI(activeServer, {dbname: database.title})
               const newSubDBSpace = [
                               {
                                   parentId: node.key,
                                   title: "Permanent_PermanentData",
                                   key: nanoid(4),
                                   icon: <FolderIcon/>,

                               },
                               {
                                   parentId: node.key,
                                   title: "Permanent_TemporaryData",
                                   key: nanoid(4),
                                   icon: <FolderIcon/>,

                               },
                               {
                                   parentId: node.key,
                                   title: "Temporary_TemporaryData",
                                   key: nanoid(4),
                                   icon: <FolderIcon/>
                               },
                               {
                                   parentId: node.key,
                                   title: "Log",
                                   key: nanoid(4),
                                   icon: <FolderIcon/>
                               }
                           ]

               setSubDBSpace([...subDBSpace, ...newSubDBSpace])
               if(result){
                   const editionProps ={
                       pagesize: result.pagesize,
                   }
                   const trees = []
                   const active = {
                       title: "active",
                       key: nanoid(4),
                       parentId: newSubDBSpace[3].key,
                       icon: <FolderIcon/>,
                       sub: []
                   }
                   const archive = {
                       title: "archive",
                       key: nanoid(4),
                       parentId: newSubDBSpace[3].key,
                       icon: <FolderIcon/>,
                       sub: []
                   }
                   result.spaceinfo.forEach(item => {
                       switch(item.type){
                           case "PERMANENT":{
                               trees.push({
                                   title: item.spacename.split("/").pop(),
                                   key: nanoid(4),
                                   parentId: newSubDBSpace[0].key,
                                   isLeaf:true,
                                   ...item,
                                   ...editionProps,
                                   type:"Volume info",
                                   typeSpace: item.type,
                                   icon: <FileIcon/>
                               })
                               break;
                           }
                           case "Active_log":{
                               active.sub.push({
                                   title: item.spacename,
                                   key: nanoid(4),
                                   isLeaf: true,
                                   ...item,
                                   ...editionProps,
                                   type:"Volume info",
                                   typeSpace: item.type,
                                   icon: <FileIcon/>

                               })
                               break;
                           }
                           case "Archive_log":{
                                archive.sub.push({
                                    title: item.spacename,
                                    key: nanoid(4),
                                    isLeaf: true,
                                    ...item,
                                    ...editionProps,
                                    type:"Volume info",
                                    typeSpace: item.type,
                                    icon: <FileIcon/>
                                })
                           }

                       }
                   })
                   trees.push(active)
                   trees.push(archive)
                   setSpaceTreeFolder(trees)
               }
           }
       }

   }
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
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



