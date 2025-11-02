import React, {useEffect, useRef, useState} from 'react';
import { Space, Table, Tag } from 'antd';
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import styles from '@/components/contents/dashboard/dashboard.module.css'
import {getBrokersAPI, getBrokerStatusAPI} from "@/api/cmApi";
import {getBrokerFormat} from "@/utils/navigation";
import {getIntervalDashboard, setIntervalDashboard} from "@/preference/pref";
import {setActivePanel} from "@/store/generalReducer";


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Status',
        dataIndex: 'state',
        key: 'status',
    },
    {
        title: 'PID',
        dataIndex: 'pid',
        key: 'pid',
    },
    {
        title: 'PORT',
        key: 'port',
        dataIndex: 'port'
    },
    {
        title: 'AS',
        key: 'as',
        dataIndex: 'as'
    },
    {
        title: 'JQ',
        key: 'jq',
        dataIndex: 'jq'
    },
    {
        title: 'REQ',
        dataIndex: 'req',
        key: 'req',
    },
    {
        title: 'TPS',
        key: 'tps',
        dataIndex: 'tps'
    },
    {
        title: 'QPS',
        key: 'qps',
        dataIndex: 'qps'
    },
    {
        title: 'LONG-T',
        key: 'long_t',
        dataIndex: 'long_tran_time',
    },
    {
        title: 'LONG-Q',
        dataIndex: 'long_query_time',
        key: 'long_q',
    },
    {
        title: 'EER-Q',
        key: 'err_q',
        dataIndex: 'error_query'
    }
];

export default function (props) {
    const {activePanel} = useSelector(state => state.general);
    const {activeServer} = useSelector(state=>state.treeReducer);
    const [brokerData, setBrokerData] = useState([]);
    const [loading, setLoading] = useState(true);
    let intervalId = null

    const getRefreshData = async () => {
        getBrokersAPI(activeServer).then(res=>{
            const newBrokers = res.result?.map(item => getBrokerFormat(item));
            const allRequest = newBrokers?.map((broker) => {
                return getBrokerStatusAPI(activeServer, {bname: broker.name});
            })
            if(allRequest){
                Promise.all(allRequest).then(responses => {
                    const dataSource = []
                    for(let i=0; i<responses.length; i++) {
                        const {success, result} = responses[i];
                        if(success){
                            dataSource.push({
                                ...newBrokers[i],
                                key: nanoid(4),
                                qps: result[0].as_num_query,
                                tps: result[0].as_num_tran
                            })
                        }
                    }
                    setLoading(false);

                    setBrokerData(dataSource)
                })
            }
        })
    }

    useEffect(()=>{
        getRefreshData()
    },[])


    useEffect(() => {
        if(intervalId){
            clearInterval(intervalId);
            intervalId = null;
        }
        if(props.uniqueKey === activePanel){
            const interval = getIntervalDashboard()
            if(interval){
                const value = parseInt(interval)
                console.log(value)
                intervalId = setInterval(getRefreshData, value * 1000)
            }
        }
    },[activePanel])

    return(
        <div className={styles.broker}>
            <Table pagination={false} bordered loading={loading} columns={columns} dataSource={brokerData} />
        </div>
    )

}

