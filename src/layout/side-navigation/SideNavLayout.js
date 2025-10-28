import React, {useState, useRef, useEffect} from "react";
import VerticalResizeLayout from "@/components/common/resizable/Resize";
import styles from "@/layout/side-navigation/SideLayout.module.css";
import {useDispatch, useSelector} from "react-redux";
import {Tabs, Tree} from "antd";
import TreeDatabase from "@/layout/side-navigation/tree-expand/TreeDatabase";
import TreeBroker from "@/layout/side-navigation/tree-expand/TreeBroker";
import {getDatabasesAPI, getHostsAPI} from "@/api/cmApi";
import {setActiveServer, setDatabases, setServers} from "@/store/treeReducer";
import {getDatabaseFormat} from "@/utils/navigation";

const Databases = [
    {
        title: 'demodb',
        icon: <i style={{color: "var(--color-yellow)"}} className={`fa-regular fa-database `}/>,
        key: '0',
        children: [
            {
                title: 'Tables',
                key: '0-0',
                icon: <i className="fa-regular fa-table" style={{color: "var(--color-light-blue)"}}/>
            },
            {
                title: 'Views',
                key: '0-1',
                icon: <i className="fa-regular fa-eye" style={{color: "var(--color-purple)"}}/>
            },
        ],
    },
];
const Brokers = [
    {
        title: 'broker1 (33000, RW)',
        key: '1',
        isLeaf: false,
        icon: <i className="fa-regular fa-folder-gear" style={{color: "#E06B80"}}/>
    },
    {
        title: 'query_editor (30000, RW)',
        key: '2',
        isLeaf: false,
        icon: <i className="fa-regular fa-folder-gear" style={{color: "#E06B80"}}/>
    },
];


const Logs = [
    {
        title: 'Broker',
        key: '3',
        isLeaf: false,
        icon: <i className="fa-solid fa-folder icon__folder" style={{color:'var(--color-yellow)'}}></i>
    },
    {
        title: 'Manager',
        key: '4',
        isLeaf: false,
        icon: <i className="fa-solid fa-folder icon__folder" style={{color:'var(--color-yellow)'}}></i>

    },
    {
        title: 'Server',
        key: '5',
        isLeaf: false,
        icon: <i className="fa-solid fa-folder icon__folder" style={{color:'var(--color-yellow)'}}></i>
    },
];

const treeData = [Databases, Brokers, Logs];



export default function Vertical() {
    const [topHeight, setTopHeight] = useState(200);
    // const [activeServer, setActiveServer] = useState(null);
    const {servers, activeServer} = useSelector((state) => state.treeReducer);
    const [activeTree, setActiveTree] = useState(0)
    const dispatch = useDispatch();
    const treeItems = ["DB", "Broker", "Log"]

    useEffect(() => {
       getHostsAPI().then(res=>{

           dispatch(setServers(res));
       })
    },[])

    useEffect(() => {
        // if(activeServer.uid){
        //     getDatabasesAPI(activeServer).then(res=>{
        //         if(res.success){
        //             const newDatabases = res.result.map(item => getDatabaseFormat(item, node));
        //             dispatch(setDatabases(newDatabases));
        //         }
        //     })
        //
        //
        // }
    }, [activeServer.uid]);
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
                            treeData={treeData[activeTree]}

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



    const tree = [
        {key: 0, children: <TreeBroker serverId={activeServer}/>, label: "TreeBroker"},
        {key: 1, children: <TreeDatabase serverId={activeServer}/>, label: "TreeDatabase"},
    ]
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div
                style={{
                    height: topHeight,
                }}
                className={styles.tree__host}
            >
                {
                    servers.map(server =>{
                        return <div
                                className={`${styles.host__item} ${server.uid === activeServer.uid ? styles.host__active : ""}`}
                            key={server.key} onClick={()=>dispatch(setActiveServer(server))}>
                            {server.alias}</div>
                    })
                }
            </div>
           <VerticalResizeLayout onChangeHeight={(newHeight)=>setTopHeight(newHeight)} />
            {getServerSection()}
        </div>
    );
}
