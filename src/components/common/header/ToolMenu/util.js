import {setLoading} from "@/state/dialogSlice";
import axios from "axios";
import {setSelectedObject} from "@/state/generalSlice";
import {setSubServer} from "@/state/subServerSlice";
import {Modal} from "antd";
import React from "react";
import {getAPIParam} from "@/utils/utils";
import {setDatabase} from "@/state/databaseSlice";
import {getDatabases, startBrokers, startDatabase, stopBrokers, stopDatabase} from "@/utils/api";

export const onStartBrokers = async (broker, state, dispatch) => {
    dispatch(setLoading(true));
    const server = state.servers.find(res => res.serverId === broker.serverId);
    const response = await axios.post("/api/start-brokers", {
        ...getAPIParam(server)
    }).then(res => res.data)
    dispatch(setLoading(false));
    if (response.status) {
        const newSubServers = state.subServers.map(res=>{
            if((res.key === broker.key)){
                const newSubBroker = {
                    ...res,
                    status: "ON",
                    icon: <i className={`fa-light fa-folder-tree`}/>
                }
                dispatch(setSelectedObject(newSubBroker))
                return newSubBroker
            }else{
                return res
            }
        })
        dispatch(setSubServer(newSubServers));
    }else{
        Modal.error({
            title: 'Broker',
            content: response.note,
            okText: 'Close',
        });
    }
}

export const onStopBrokers = async (broker, state, dispatch) => {
    dispatch(setLoading(true));
    const server = state.servers.find(res => res.serverId === broker.serverId);
    const response = await axios.post("/api/stop-brokers", {
        ...getAPIParam(server)
    }).then(res => res.data)
    dispatch(setLoading(false));
    if (response.status) {
        const newSubServers = state.subServers.map(res=>{
            if((res.key === broker.key)){
                const newSubBroker = {
                    ...res,
                    status: "OFF",
                    icon: <i className={`fa-light fa-folder-tree warning`}/>
                }
                dispatch(setSelectedObject(newSubBroker))
                return newSubBroker
            }else{
                return res
            }
        })
        dispatch(setSubServer(newSubServers));
    }else{
        Modal.error({
            title: 'Broker',
            content: response.note,
            okText: 'Close',
        });
    }
}


export const onStartDatabase = async (node, state, dispatch) => {
    dispatch(setLoading(true));
    const server = state.servers.find(res => res.serverId === node.serverId);
    const response = await axios.post("/api/start-db", {
        ...getAPIParam(server),
        database: node.title,
    }).then(res => res.data)
    dispatch(setLoading(false));
    if (response.status) {
        const newDatabases = state.databases.map((item) => {
            if (item.key === node.key) {
                const newObject = {...item,
                    status: "active",
                    icon: <i className={`fa-light fa-database success`}/>,
                };
                dispatch(setSelectedObject(newObject))
                return newObject
            }
            return item;
        })

        dispatch(setDatabase(newDatabases));

    }else{
        Modal.error({
            title: 'Database',
            content: response.note,
            okText: 'Close',
        });
    }
}


export const onStopDatabase = async (node, state, dispatch) => {
    dispatch(setLoading(true));
    const server = state.servers.find(res => res.serverId === node.serverId);
    const response = await axios.post("/api/stop-db", {
        ...getAPIParam(server),
        database: node.title,
    }).then(res => res.data)
    dispatch(setLoading(false));
    if (response.status) {
        const newDatabases = state.databases.map((item) => {
            if (item.key === node.key) {
                const newObject = {...item,
                    status: "inactive",
                    icon: <i className={`fa-light fa-database warning`}/>,
                };
                dispatch(setSelectedObject(newObject))
                return newObject
            }
            return item;
        })

        dispatch(setDatabase(newDatabases));

    }else{
        Modal.error({
            title: 'Database',
            content: response.note,
            okText: 'Close',
        });
    }
}


export const onStartService = async (node, dispatch) => {
    dispatch(setLoading(true));
    // get all databases
    const response = await getDatabases(getAPIParam(node))
    if(response.status) {
        for(let database of response.result) {
            if(database.status === "inactive") {
                // start all of inactive databases
                const res = await startDatabase({...getAPIParam(node), database: database.dbname });
                if(!res.status) {
                    break;
                }
            }
        }
    }
    // start brokers
    await startBrokers(getAPIParam(node))
    dispatch(setLoading(false));

}


export const onStopService = async (node, dispatch) => {
    dispatch(setLoading(true));
    // get all databases
    console.log(node)
    const response = await getDatabases(getAPIParam(node))
    if(response.status) {
        for(let database of response.result) {
            if(database.status === "active") {
                // stop all active databases
                const res = await stopDatabase({...getAPIParam(node), database: database.dbname });
                if(!res.status) {
                    break;
                }
            }
        }
    }
    // stop brokers
    await stopBrokers(getAPIParam(node)).then(res => res.data);
    dispatch(setLoading(false));

}