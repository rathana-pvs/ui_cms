import {getLocalStorage, setLocalStorage} from "@/utils/storage";
import axios from "axios";
import {loginAPI} from "@/lib/api";


export const setToken = async ({host, port, id, password}) => {

    const response = await loginAPI({host, port, id, password})
    if(response.token){
        setLocalStorage("token", response.token);
    }
    return response

}