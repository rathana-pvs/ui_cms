import axios from "axios";
import {request} from "@/utils/request";
import {Modal} from "antd";
import {getAPIParam, isNotEmpty} from "@/utils/utils";
import {getFromStore, selectTreeReducer} from "@/utils/getFromStore";

const url = "/api/proxy/cms-https-client/forward"

export const requestCMAPI = (server, payload)=>{
    const {uid} = server;
    return axios.post(`${url}/${uid}`, payload);
}

export const getResponse = async (server, payload) => {

    let response = null
    try{
        const {data} = await requestCMAPI(server, payload);
        return {...data, success: data.status === "success" };
    }catch(error){
        console.log(error)
        if (error.response.status === 401) {
            console.warn("Unauthorized. Revoking auth...");
            try {
                await axios.post("/api/proxy/cms-auth/login", server) // revoke session/token
                console.info("Auth revoked. Retrying /host...");

                const {data} = await requestCMAPI(server, payload);
                return {...data, success: data.status === "success" };
            } catch (retryError) {
                console.error("Retry failed:", retryError);
                throw retryError;
            }

        }
        throw error;
    }

}
export const getHostsAPI = async () => {
    return axios.get("/api/proxy/host").then(res => {
        if(res.status === 200) {
            return Object.values(res.data.host_list)
        }
         return []
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
