import {useEffect} from "react";


const TreeDatabase = ({serverId})=> {

    useEffect(()=>{
        console.log(serverId);
    },[serverId])

    return (
        <div>
            database
        </div>
    )
}

export default TreeDatabase;