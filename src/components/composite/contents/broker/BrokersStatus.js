import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import {nanoid} from "nanoid";
import {useSelector} from "react-redux";
import {getBrokerStatusAPI} from "@/lib/api";
import styles from "@/components/composite/contents/broker/broker.module.css"


const columns = [
    {
        title: 'NAME',
        dataIndex: 'name',
        key: nanoid(4)
    },
    {
        title: 'STATUS',
        dataIndex: 'state',
        key: nanoid(4)
    },
    {
        title: 'PID',
        dataIndex: 'pid',
        key: nanoid(4)
    },
    {
        title: 'PORT',
        dataIndex: 'port',
        key: nanoid(4),
    },
    {
        title: 'AS',
        dataIndex: 'as',
        key: nanoid(4),
    },
    {
        title: 'JQ',
        dataIndex: 'jq',
        key: nanoid(4),
    },
    {
        title: 'REQ',
        key: nanoid(4),
        dataIndex: 'req',
    },
    {
        title: 'TPS',
        key: nanoid(4),
        dataIndex: 'tps'
    },
    {
        title: 'QPS',
        key: nanoid(4),
        dataIndex: 'qps'
    }
];

export default function (props){
    const {brokers} = useSelector(state=>state.treeReducer);
    const {selectedObject} = useSelector(state=>state.general);
    const [info, setInfo] = useState([]);

    const getBrokerInfo = async () => {

        const data = []
        // for (let object of brokers) {
        //
        //     const {result} = await getBrokerStatusAPI(selectedObject, {bname: object.name})
        //     data.push({
        //         key: nanoid(4),
        //         ...object.data,
        //         qps: result[0].as_num_query,
        //         tps: result[0].as_num_tran
        //     })
        // }
        const allRequest = brokers.map(broker => {
            return getBrokerStatusAPI(selectedObject, {bname: broker.name})
        });
        const responses = await Promise.all(allRequest);

        for(let i=0; i<responses.length; i++) {
            const {success, result} = responses[i];
            if(success){
                data.push({
                    ...brokers[i],
                    key: nanoid(4),
                    qps: result[0].as_num_query,
                    tps: result[0].as_num_tran
                })
            }
        }
        setInfo(data)
    }

    useEffect(()=>{
        getBrokerInfo()
    },[])

    return (
        <div className={styles.brokers}>
            <Table bordered pagination={false} columns={columns} dataSource={info} />
        </div>

    )
}