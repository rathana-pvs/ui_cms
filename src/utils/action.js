import {getResponse} from "@/api";
import {getFromStore, selectTreeReducer} from "@/utils/getFromStore";
import {setBrokers, setSubServers} from "@/store/treeReducer";
import {setLoading} from "@/store/dialogReducer";
import React from "react";

export const startAllBroker = async (node, dispatch) => {
    const {servers, subServers, brokers} = getFromStore(selectTreeReducer)
    const server = servers.find(res => res.serverId === node.serverId)
    dispatch(setLoading(true))
    const response = await getResponse(server, {task: "startbroker"})
    dispatch(setLoading(false))
    if (response.status === "success") {
        const newSubServers = subServers.map(res => {
            if (res.key === node.key) {
                return {
                    ...res,
                    status: "ON",
                    icon: <i className={`fa-light fa-folder-tree success`}/>
                }
            }
            return res
        })
        const newBrokers = brokers.map(res => {
            return {
                ...res,
                status: "ON",
                icon: <i className={`fa-light fa-folder-gear success`}/>
            }
        })
        dispatch(setBrokers(newBrokers))
        dispatch(setSubServers(newSubServers));
    }
}

export const stopAllBrokers = async (node, dispatch) => {
    const {servers, subServers, brokers} = getFromStore(selectTreeReducer)
    const server = servers.find(res => res.serverId === node.serverId)
    dispatch(setLoading(true))
    const response = await getResponse(server, {task: "stopbroker"})
    dispatch(setLoading(false))
    if (response.status === "success") {
        const newSubServers = subServers.map(res => {
            if (res.key === node.key) {
                return {
                    ...res,
                    status: "OFF",
                    icon: <i className={`fa-light fa-folder-tree warning`}/>
                }
            }
            return res
        })
        const newBrokers = brokers.map(res => {
            return {
                ...res,
                status: "OFF",
                icon: <i className={`fa-light fa-folder-gear warning`}/>
            }
        })
        dispatch(setBrokers(newBrokers))
        dispatch(setSubServers(newSubServers));
    }
}
