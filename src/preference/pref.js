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


export const setIntervalDashboard = (value)=>{
    localStorage.setItem(prefIntervalDashboard, value)
}

export const getIntervalDashboard = ()=>{
    return localStorage.getItem(prefIntervalDashboard);
}
