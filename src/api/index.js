import {request} from "@/utils/request";
import {Modal} from "antd";
import {getAPIParam, isNotEmpty} from "@/utils/utils";
import {getFromStore, selectTreeReducer} from "@/utils/getFromStore";


export const getResponse = async (node, data) => {
    const {servers} = getFromStore(selectTreeReducer)
    const server = servers.find(res => res.serverId === node.serverId)
    const payload = {
        ...getAPIParam(server),
        ...data
    }
    const response = await request.post("/api/general", payload)
        .then(res => res.data);
    if (response.status !== "success") {
        Modal.error({
            title: 'Error',
            content: response.note,
            okText: 'Close',
        });
    }
    return {...response, success: response.status === "success" };
}
export const loginAPI = async (data) => {

    return await request.post("/api/login", data)
        .then(res => res.data);
}



export const getBrokersAPI = async (server, data) => {
    let payload = {
        task: "getbrokersinfo",
        ...data
    }
    const response = await getResponse(server, payload)

    return {...response, result: response.brokersinfo[0]?.broker};
}

export const getDatabasesAPI = async (server, data) => {
    let payload = {
        task: "startinfo",
        ...data
    }
    const response = await getResponse(server, payload);

    let databases = []

    if(response.success) {
        if(isNotEmpty(response.activelist)){
            for(let db of response.activelist[0].active){
                databases.push({...db, status: "active"});
            }
        }
        if(isNotEmpty(response.dblist)){
            for (let db of response.dblist[0].dbs){
                if (!databases.some(obj => obj.dbname === db.dbname)) {
                    databases.push({...db, status: "inactive"});
                }

            }
        }
        return {result: databases, success: true};
    }

    return {success: false};
}

export const loginDatabaseAPI = async (server, data) => {
    let payload = {
        task: "dbmtuserlogin",
        ...data
    }
    const response = await getResponse(server, payload)
    return {result: response};
}

export const getTablesAPI = async (server, data, type) => {
    let payload = {
        task: "classinfo",
        ...data
    }
    const response = await getResponse(server, payload)

    const {systemclass, userclass} = response;
    let result = {system_class: [], user_class: []}
    if(isNotEmpty(systemclass)){
        result.system_class = systemclass[0].class.filter(res=>res.virtual === type);
    }
    if(isNotEmpty(userclass)){
        result.user_class = userclass[0].class.filter(res=>res.virtual === type);
    }
    return {result};
}

export const getDBUsersAPI = async (server, data, type) => {
    let payload = {
        task: "userinfo",
        ...data
    }
    const response = await getResponse(server, payload)
    return {result: response.user};
}

export const getTriggerAPI = async (server, data) => {
    let payload = {
        task: "gettriggerinfo",
        ...data
    }
    const response = await getResponse(server, payload)
    let result = []
    if(response.triggerlist){
        result = response.triggerlist[0]?.triggerinfo;
    }
    return {result};
}

export const getBrokerLogAPI = async (server, data) => {
    let payload = {
        task: "getlogfileinfo",
        ...data
    }
    const response = await getResponse(server, payload)

    return {result: response.logfileinfo[0].logfile};
}

export const getAdminLogAPI = async (server, data) => {
    let payload = {
        task: "getadminloginfo",
        ...data
    }
    const response = await getResponse(server, payload)

    return {result: response.adminloginfo};
}

export const getLogInfoAPI = async (server, data) => {
    let payload = {
        task: "getloginfo",
        ...data
    }
    const response = await getResponse(server, payload)

    return {result: response.loginfo[0]?.log};
}

export const getAllSystemParamAPI = async (node, data) => {
    let payload = {
        task: "getallsysparam",
        ...data
    }
    const response = await getResponse(node, payload)
    return {result: response.conflist[0].confdata, success: response.success}
}

export const getBrokerStatusAPI = async (node, data) => {
    let payload = {
        task: "getbrokerstatus",
        ...data
    }
    const response = await getResponse(node, payload)
    if(response.success){
        return {result: response.asinfo, success: true};
    }
    return {success: false};
}

