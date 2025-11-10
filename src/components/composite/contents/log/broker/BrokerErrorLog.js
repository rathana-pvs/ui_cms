import { Table } from 'antd';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getResponse} from "@/lib/api";

const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 60,
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: "Error Type",
        dataIndex: 'errortype',
        key: 'errortype',
    },
    {
        title: 'Error Code',
        dataIndex: 'errorcode',
        key: 'errorcode',
    },
    {
        title: 'Tran ID',
        dataIndex: 'tranid',
        key: 'trandid',
    },
    {
        title: 'Error Message',
        dataIndex: 'errormessage',
        key: 'errormessage',
        width: 200,
        wrap: true,
    }
];


function parseTable(logLines) {
    const parsedLogs = [];
    let i = 0;
    let no = 1;

    while (i < logLines.length) {
        const line = logLines[i];

        if (line.startsWith("Time:")) {
            const timeMatch = line.match(/^Time:\s(.+?)\s-\s(\w+)/);
            const errorType = timeMatch?.[2] ?? "";
            const time = timeMatch?.[1] ?? "";

            const errorCodeMatch = line.match(/ERROR CODE\s*=\s*(-?\d+)/);
            const errorcode = errorCodeMatch?.[1] ?? "";

            const tranIdMatch = line.match(/Tran\s*=\s*(-?\d+)/);
            const tranid = tranIdMatch?.[1] ?? "";

            const fileNoteMatch = line.match(/\*\*\*\sfile\s(.+?),\sline\s\d+/);
            const errornote = fileNoteMatch?.[1] ?? "";
            let fileNote = ""
            if(fileNoteMatch){
                fileNote = line.split("*** file")[1]
            }

            const errormessage = logLines[i + 1] || "";

            parsedLogs.push({
                no: no++,
                time,
                errortype: errorType,
                errorcode,
                tranid,
                errormessage: fileNote + " "+ errormessage,
            });

            i += 2;
        } else {
            i++;
        }
    }
    return parsedLogs;
}

export default function (){
    const {contents, activePanel} = useSelector(state => state.general);
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadLogs = async () => {
        setLoading(true)
        const content = contents.find(res => res.key === activePanel)
        const response = await getResponse(content, {task: "viewlog", path: content.path})
        setLoading(false)
        if(response.success){
            setMessage(parseTable(response.log?.[0]?.line));
        }
    }
    useEffect(() => {
        loadLogs()
    }, []);

    return <Table dataSource={message} loading={loading} columns={columns} pagination={{ defaultPageSize: 30 }} />;
}


