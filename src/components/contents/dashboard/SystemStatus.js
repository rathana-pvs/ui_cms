import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
import {useSelector} from "react-redux";
import {getBrokersInfo, getBrokerStatus, getDatabases, getDBSpace, getHostStat} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {getResponse} from "@/api";
const columns = [
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Memory',
        dataIndex: 'memory',
        key: 'memory',
    },
    {
        title: 'Disk',
        dataIndex: 'disk',
        key: 'disk',
    },
    {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
    },
    {
        title: 'TPS',
        dataIndex: 'tps',
        key: 'tps',
    },
    {
        title: 'QPS',
        dataIndex: 'qps',
        key: 'qps',
    }
];


function bytesToGB(bytes, precision = 2) {
    return (bytes / (1024 ** 3)).toFixed(precision);
}

function getDeltaLong(fieldA, fieldB, fieldC) {
    try {
        let a = BigInt(fieldA);
        let b = BigInt(fieldB);
        let c = BigInt(fieldC);



        // Normal difference
        let delta = a - b;

        // If negative, re-sync using c
        if (delta < 0) {
            delta = b - c;
        }

        return delta;
    } catch {
        return 0;
    }
}

export default function (){
    const {brokers, servers} = useSelector(state=>state);
    const {selectedObject} = useSelector(state=>state.general);
    const [data, setData] = useState([]);
    const [usage, setUsage] = useState([]);
    const [cpu, setCPU] = useState(0);


    const updateValue = async () => {
        const server = servers.find(res => res.serverId === selectedObject.serverId)
        const response = await getHostStat({...getAPIParam(server)})
        if(usage.length <3){
            setUsage(prevUsage => ([...prevUsage, ...response.result]));
        }else{
            let temp = [...usage]
            temp.shift()
            temp.push(response.result)
            setUsage(temp)
        }

    }




    useEffect(async () => {
        if (selectedObject.serverId) {
            const server = servers.find(res => res.serverId === selectedObject.serverId)
            const response = await getHostStat({...getAPIParam(server)})
            const resSpaceInfo = await getResponse({...getAPIParam(server), database: "demodb"})
            if(response.status){
                const {mem_phy_free, mem_phy_total} = response.result
                setUsage([response.result]);
                let tps = 0
                let qps = 0
                let temp = {
                    time: "Now",
                    disk: "-",
                    memory: `${bytesToGB(mem_phy_total - mem_phy_free)}GB / ${bytesToGB(mem_phy_total)}GB`,

                }

                const brokerInfo = await getBrokersInfo({...getAPIParam(server)})

                if(brokerInfo.status){
                    brokerInfo.result.forEach(res=>{
                        tps = tps + parseInt(res.long_tran)
                        qps = qps + parseInt(res.long_query)
                    })
                }
                temp["tps"] = tps
                temp["qps"] = qps

                if(resSpaceInfo.status){
                    temp["disk"] = (resSpaceInfo.result.freespace / 1024).toFixed(1) + "GB"
                }
                setData([temp])
            }

        }

    },[selectedObject])


    return <Table pagination={false} columns={columns} dataSource={data} />
}
