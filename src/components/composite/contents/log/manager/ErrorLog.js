import { Table } from 'antd';
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {getResponse} from "@/lib/api";

const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 60,
    },
    {
        title: 'User',
        dataIndex: '@user',
        key: 'user',
    },
    {
        title: "Task Name",
        dataIndex: 'taskname',
        key: 'taskname',
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Description',
        dataIndex: 'errornote',
        key: 'errornote',
    }
];


export default function (){
    const {contents, activePanel} = useSelector(state => state.general);
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadLogs = async () => {
        setLoading(true)
        const content = contents.find(res => res.key === activePanel)
        const response = await getResponse(content, {task: "loadaccesslog"})
        setLoading(false)
        if(response.success){
            setMessage(response.errorlog
                .map((item, index) => ({no: index + 1, ...item})))
        }
    }
    useEffect(() => {
        loadLogs()
    }, []);

    return <Table dataSource={message} loading={loading} columns={columns} pagination={{ defaultPageSize: 30 }} />;
}


