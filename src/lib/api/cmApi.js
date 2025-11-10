import axios from "axios";
import {request} from "@/utils/request";
import {Modal} from "antd";
import {getAPIParam, isNotEmpty} from "@/utils/utils";
import {getFromStore, selectTreeReducer} from "@/utils/getFromStore";

const url = "/api/proxy/cms-https-client/forward"

export const requestCMAPI = (server, payload)=>{
    const {uid} = server;
    return axios.post(`${url}`, {...payload, hostUid: uid});
}

export const revokeLogin = async (server) => {
    try {
        await axios.post("/api/proxy/cms-auth/login", {hostUid: server.uid}) // revoke session/token
        return true
    } catch (retryError) {
        return false
    }
}

export const getResponse = async (server, payload) => {

    try{
        const {data} = await requestCMAPI(server, payload);
        if (data.status === "failure" &&
            data.note?.includes("invalid token")) {
            await revokeLogin(server);
            const {data} = await requestCMAPI(server, payload);
            return {...data, success: data.status === "success" };
        }
        return {...data, success: data.status === "success" };
    }catch(error){

        if (error.response.status === 401) {
            console.warn("Unauthorized. Revoking auth...");
            try {
                const status = await revokeLogin(server);
                if(status){
                    const {data} = await requestCMAPI(server, payload);
                    return {...data, success: data.status === "success" };
                }

            } catch (retryError) {
                console.error("Retry failed:", retryError);
                throw retryError;
            }

        }
       return {status: false}
    }

}

export const addHostAPI = (payload)=>{
    return axios.post("/api/proxy/host", payload).then(res => {
        if(res.status === 201) {
           return {status: true}
        }
        return false;
    })
}

export const updateHostAPI = async (server, payload) => {
    return axios.put(`/api/proxy/host`, {...payload, hostUid: server.uid}).then(res => {
        if(res.status === 200) {
            return {...res, status: true};
        }
        return false;

    })
}


export const getHostsAPI = async () => {
    return axios.get("/api/proxy/host").then(res => {
        if(res.status === 200) {
            return Object.values(res.data.host_list)
        }
         return []
    })

}

export const deleteHostAPI = async (server) => {
    return axios.delete(`/api/proxy/host`, {data:{hostUid: server.uid}}).then(res => {
        if(res.status === 200) {
            return {...res, status: true};
        }
        return false;

    })
}




export const getDatabasesAPI = async (server) => {
    let payload = {
        task: "startinfo"
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

export const getBrokersAPI = async (server) => {
    let payload = {
        task: "getbrokersinfo"
    }
    const response = await getResponse(server, payload)

    return {...response, result: response.brokersinfo?.[0].broker};
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

export const getAllSystemParamAPI = async (node, data) => {
    let payload = {
        task: "getallsysparam",
        ...data
    }
    const response = await getResponse(node, payload)
    return {result: response.conflist[0].confdata, success: response.success}
}

