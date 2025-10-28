import React, {useEffect, useState} from 'react';
import {Divider, Table} from 'antd';
import {nanoid} from "nanoid";
import {useSelector} from "react-redux";
import {getBrokerStatusAPI} from "@/api";
const columns = [
    {
        title: 'PID',
        dataIndex: 'pid',
        key: '1'
    },
    {
        title: 'PORT',
        dataIndex: 'port',
        key: '2',
    },
    {
        title: 'JOB QUE',
        dataIndex: 'jq',
        key: '3',
    },
    {
        title: 'AUTO ADD APPLY SERVER',
        key: '5',
        dataIndex: 'auto',
        // ellipsis: true,
    },
    {
        title: 'SQL LOG MODE',
        key: '5',
        dataIndex: 'sqll'
    },
    {
        title: 'SESSION TIMEOUT',
        key: '6',
        dataIndex: 'ses'
    },
    {
        title: 'KEEP CONNECTION',
        dataIndex: 'keep_conn',
        key: '7',
        // ellipsis: true,
    },
    {
        title: 'ACCESS MODE',
        key: '8',
        dataIndex: 'access_mode',
    }
];


const columnsStatus = [
    {
        title: 'ID',
        dataIndex: 'as_id',
        key: '1'
    },
    {
        title: 'PID',
        dataIndex: 'as_pid',
        key: '2',
    },
    {
        title: 'QPS',
        dataIndex: 'as_num_query',
        key: '3',
    },
    {
        title: 'LQS',
        dataIndex: 'as_long_query',
        key: '4'
    },
    {
        title: 'PSIZE',
        dataIndex: 'as_psize',
        key: '5',
    },
    {
        title: 'STATUS',
        dataIndex: 'as_status',
        key: '6',
    },
    {
        title: 'DB',
        dataIndex: 'as_dbname',
        key: '8',
    },
]


const columnsJobQue = [
    {
        title: 'ID',
        dataIndex: 'as_id',
        key: '1'
    },
    {
        title: 'PRIORITY',
        dataIndex: 'as_priority',
        key: '2',
    },
    {
        title: 'ADDRESS',
        dataIndex: 'as_address',
        key: '3',
    },
    {
        title: 'TIME',
        dataIndex: 'as_time',
        key: '4'
    },
    {
        title: 'REQ',
        dataIndex: 'as_req',
        key: '5',
    }
]

export default function (props){
    const {selectedObject} = useSelector(state=>state.general);
    const [info, setInfo] = useState([]);
    const [brokerStatus, setBrokerStatus] = useState([]);
    const [statusLoading, setStatusLoading] = useState(true);
    const getBrokerInfo = async () => {
        const response = await getBrokerStatusAPI(selectedObject, {bname: selectedObject.name})
        if(response.success){
            const newBrokerStatus = response.result.map(res=>{
                return {...res, key: nanoid(8)}
            })
            setBrokerStatus(newBrokerStatus)
        }
        console.log(selectedObject)
        setInfo([{...selectedObject, key: nanoid(8), icon: null}])
        setStatusLoading(false);

    }

    useEffect(()=>{
        getBrokerInfo()

    },[])
    return (
        <div style={{padding: "8px 12px"}}>
            <Table bordered loading={statusLoading} pagination={false} columns={columns} dataSource={info}
                   expandable={{
                       expandedRowRender: record => <p>{record.description}</p>,
                       showExpandColumn: false, // 🚫 hides the [+] column
                   }}
            />
            <Divider />
            <Table loading={statusLoading} bordered pagination={false} columns={columnsStatus} dataSource={brokerStatus} />
            <div style={{height: 12, width: "100%"}}></div>
            <p className={"medium__text"}>Job Que</p>
            <Table bordered pagination={false} columns={columnsJobQue} dataSource={[]} />
        </div>

    )
}