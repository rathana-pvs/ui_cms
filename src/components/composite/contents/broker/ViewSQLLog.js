import { Table } from 'antd';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLoading} from "@/store/dialogReducer";
import {getResponse} from "@/lib/api";

const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 60,
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
    },
];


export default function (){
    const {contents, activePanel} = useSelector(state => state.general);
    const dispatch = useDispatch()
    const [message, setMessage] = useState([]);
    const loadLogs = async () => {
        const content = contents.find(res => res.key === activePanel)
        dispatch(setLoading(true))
        const response = await getResponse(content, {task: "viewlog", path: content.path})
        dispatch(setLoading(false))
        if(response.success){
            setMessage(response.log?.[0]?.line.map((item, index) => ({no: index + 1, message: item})))
        }
    }
    useEffect(() => {
        loadLogs()
    }, []);

    return <Table dataSource={message} columns={columns} pagination={false} />;
}


