import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {getResponse} from "@/api/cmApi";

export default function (){
    const {servers, activeServer} = useSelector(state=>state.treeReducer);
    const [server, setServer] = useState({});
    const [version, setVersion] = useState({});
    useEffect(() => {
        if (activeServer.serverId) {
            const server = servers.find(res => res.uid === activeServer.uid)
            setServer(server)
            getResponse(activeServer, {task:"getenv"}).then(res=>{
                if(res.success){
                    setVersion(res)
                }

            })



        }
    },[])


    return <div>
        <p><b>Host:</b> {server.host}:{server.port}</p>
        <p><b>Cubrid Version:</b> {version.CUBRIDVER}</p>
        <p><b>Broker Version:</b> {version.BROKERVER}</p>
        <p><b>Database Path:</b> {version.CUBRID}</p>
    </div>
}
