import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import styles from '@/components/contents/dashboard/dashboard.module.css'
import {getBrokerStatusAPI} from "@/api/cmApi";


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

export default function () {
    const {brokers, activeServer} = useSelector(state=>state.treeReducer);
    const [brokerData, setBrokerData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
            const allRequest = brokers?.map((broker) => {
                return getBrokerStatusAPI(activeServer, {bname: broker.name});
            })
        if(allRequest){
            Promise.all(allRequest).then(responses => {
                const dataSource = []
                for(let i=0; i<responses.length; i++) {
                    const {success, result} = responses[i];
                    if(success){
                        dataSource.push({
                            ...brokers[i],
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

    },[brokers])

    return(
        <div className={styles.broker}>
            <Table pagination={false} bordered loading={loading} columns={columns} dataSource={brokerData} />
        </div>
    )

}

