import {getLocalStorage, setLocalStorage} from "@/utils/storage";
import {prefAutoStartupDatabase, prefIntervalDashboard} from "@/preference/variable";
import {nanoid} from "nanoid";


export const setPrefAutoStartupDatabase = (node)=>{
    const key = `${node.serverId}.${node.database}`
    const prev = getLocalStorage(prefAutoStartupDatabase);
    if(prev){
        setLocalStorage(prefAutoStartupDatabase, [...new Set([...prev, key])])
    }else{
        setLocalStorage(prefAutoStartupDatabase, [key])
    }

}

export const deletePrefAutoStartupDatabase = (node)=>{
    const key = `${node.serverId}.${node.database}`
    const prev = getLocalStorage(prefAutoStartupDatabase);
    if(prev){
        let newPref = prev.filter(pre=>pre !== key)
        setLocalStorage(prefAutoStartupDatabase, newPref )
    }
}

export const getPrefAutoStartupDatabase = ()=>{
   return getLocalStorage(prefAutoStartupDatabase)
}


export const setIntervalDashboard = (node, value)=>{
    const payload = {[node.uid]: value}
    const prev = getLocalStorage(prefIntervalDashboard);
    if(prev){
        setLocalStorage(prefIntervalDashboard, {...prev, ...payload})
    }else{
        setLocalStorage(prefIntervalDashboard, payload)
    }
}

export const getIntervalDashboard = ()=>{
    return getLocalStorage(prefIntervalDashboard) || {};
}
