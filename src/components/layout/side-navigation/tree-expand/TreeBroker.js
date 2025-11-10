import {useEffect} from "react";


const TreeBroker = ({serverId})=> {

    useEffect(()=>{
        console.log(serverId);
    },[serverId])

    return (
        <div>
            broker
        </div>
    )
}

export default TreeBroker;