import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
import {useSelector} from "react-redux";
import {getBrokersInfo, getBrokerStatus, getDatabases, getDBSpace, getHostStat, getVersion} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {q} from "framer-motion/m";
import {error} from "next/dist/build/output/log";
const columns = [
    {
        title: 'Group/Host',
        dataIndex: 'server',
        key: 'server',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Port',
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'Permanent',
        dataIndex: 'permanent',
        key: 'permanent',
    },
    {
        title: 'Temporary',
        dataIndex: 'temp',
        key: 'temp'
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
    },
    {
        title: 'TPS',
        dataIndex: 'tps',
        key: 'tps',
    },
    {
        title: 'EER-Q',
        dataIndex: 'eer-q',
        key: 'eer-q',
        onHeaderCell: () => ({
            style: {whiteSpace: 'nowrap'},
        })
    },
    {
        title: 'Memory',
        dataIndex: 'memory',
        key: 'memory',
        onHeaderCell: () => ({
            style: { minWidth: 150 },
        }),
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
        title: 'Connected',
        dataIndex: 'connected',
        key: 'connected',
    },
    {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: 'Broker Port',
        dataIndex: 'broker_port',
        key: 'broker_port',
        onHeaderCell: () => ({
            style: { minWidth: 180 },
        }),
    },

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
    const [tableLoading, setTableLoading] = useState(true);


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


    const initData = async () => {
        let allData = []
        for(const server of servers){
            let temp = {
                server: server.title,
                address: server.host,
                port: server.port,
                user: server.id,
                generic: "-",
                data: "-",
                index: "-",
                temp: "-",
                tps: "-",
                qps: "-",
                "eer-q": "-",
                version: "-",
                broker_port: "-",
                disk: "-",
                cpu: "-",
                memory: "-/-",
                connected: server.connected ? "Yes": "No"
            }
            if(server.connected){
                const env = await getVersion({...getAPIParam(server)})
                const response = await getHostStat({...getAPIParam(server)})
                if(env.status){
                    temp["version"] = env.result.CUBRIDVER.match(/\d+\.\d+/)[0]
                }
                if (response.status) {
                    const {mem_phy_free, mem_phy_total} = response.result
                    setUsage([response.result]);
                    let tps = 0
                    let qps = 0
                    let eer_q = 0
                    let port = ""
                    temp = {
                        ...temp,
                        time: "Now",
                        memory: `${bytesToGB(mem_phy_total - mem_phy_free)}GB / ${bytesToGB(mem_phy_total)}GB`,

                    }

                    const brokerInfo = await getBrokersInfo({...getAPIParam(server)})

                    if (brokerInfo.status) {
                        brokerInfo.result.forEach(res => {
                            tps = tps + parseInt(res.long_tran)
                            qps = qps + parseInt(res.long_query)
                            eer_q = eer_q + parseInt(res.error_query)
                            port = port + res.port + " "

                        })
                    }
                    temp["tps"] = tps
                    temp["qps"] = qps
                    temp["eer-q"] = eer_q
                    temp["broker_port"] = port

                }

                const {
                    permanent,
                    temporary,
                    freeSpace
                } = await getSpaceInfo(server)
                temp["permanent"] = permanent ? permanent + "%" : "-"
                temp["temp"] = temporary ? temporary + "%": "-"
                temp["disk"] = freeSpace ? bytesToGB(freeSpace) + "GB" : "-"
            }
            allData.push(temp)

        }
        setData(allData);
        setTableLoading(false);



    }

    const getSpaceInfo = async (server) => {
        const resDB = await getDatabases(getAPIParam(server));
        let totalPagePermanent = 0;
        let totalFreePagePermanent = 0;
        let totalPageTemp = 0
        let totalFreePageTemp = 0;
        let freeSpace = 0
        if(resDB.status){
            for(const database of resDB.result){
                const resSpaceInfo = await getDBSpace({...getAPIParam(server), database: database.dbname})
                if(resSpaceInfo.status){
                    freeSpace = parseInt(resSpaceInfo.result.freespace) * 1024**2
                    for(const spaceInfo of resSpaceInfo.result.spaceinfo){
                        if(spaceInfo.type === "PERMANENT"){
                            totalFreePagePermanent = totalFreePagePermanent + parseInt(spaceInfo.freepage)
                            totalPagePermanent = totalPagePermanent + parseInt(spaceInfo.totalpage)
                        }else if(spaceInfo.type === "TEMPORARY"){
                            totalFreePageTemp = totalFreePageTemp + parseInt(spaceInfo.freepage)
                            totalPageTemp = totalPageTemp + parseInt(spaceInfo.totalpage)
                        }
                    }
                }

            }
        }
        return {
            permanent: parseInt(( totalFreePagePermanent * 100 ) / totalPagePermanent),
            temporary: parseInt((totalFreePageTemp * 100) / totalPageTemp),
            freeSpace
        }

    }


    useEffect(() => {
        initData()


    },[])


    return <Table pagination={false} loading={tableLoading} columns={columns} dataSource={data}
    />
}
