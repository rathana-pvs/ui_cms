import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {getResponse} from "@/api";

export default function (){
    const {servers} = useSelector(state=>state.treeReducer);
    const {selectedObject} = useSelector(state=>state.general);
    const [server, setServer] = useState({});
    const [version, setVersion] = useState({});
    useEffect(() => {
        if (selectedObject.serverId) {
            const server = servers.find(res => res.serverId === selectedObject.serverId)
            setServer(server)
            getResponse(selectedObject, {task:"getenv"}).then(res=>{
                if(res.success){
                    setVersion(res)
                }

            })



        }
    },[selectedObject])


    return <div>
        <p><b>Host:</b> {server.host}:{server.port}</p>
        <p><b>Cubrid Version:</b> {version.CUBRIDVER}</p>
        <p><b>Broker Version:</b> {version.BROKERVER}</p>
        <p><b>Database Path:</b> {version.CUBRID}</p>
    </div>
}
