import React, {useEffect, useState} from "react";
import {Button, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setExportHost} from "@/state/dialogSlice";
import {nanoid} from "nanoid";


const columns =  [
    {
        title: 'Host Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Host Port',
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: 'Host Address',
        dataIndex: 'host',
        key: 'host',
    },
    {
        title: 'User Name',
        dataIndex: 'username',
        key: 'username',
    },
]



export default function (){

    const {servers} = useSelector(state => state);
    const {exportHost} = useSelector(state => state.dialog);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const dispatch = useDispatch();
    const [fileName, setFileName] = useState("hosts.xml");

    const buildContent = ()=>{
        let content = ``
        for(let key of selectedRowKeys){
            let server = servers.find(res=>res.serverId===key)
            content += `\t<host address="${server.host}" id="${server.key}" jdbcDriver="Auto Detect" name="${server.title}" port="${server.port}" soTimeOut="10000" user="${server.id}"/>\n`
        }
        return `<?xml version="1.0" encoding="UTF-8"?>
<hosts>
${content}
</hosts>`;
    }

    function handleDownload() {
        const blob = new Blob([buildContent()], { type: "application/xml" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
    const handleOk = async () => {
        handleDownload()
        handleClose()
    };

    const handleClose = () => {
        dispatch(setExportHost(false));
        setSelectedRowKeys([]);
    }

    useEffect(()=>{
        let data = servers.map(res=>{
            return {
                name: res.name,
                port: res.port,
                host: res.host,
                username: res.id,
                id: nanoid(4),
                key: res.serverId,
            }
        })
        setDataSource(data)

    }, [servers]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {

            setSelectedRowKeys(keys);
        },
    };

    return (
        <Modal
            title="Export Host"
            open={exportHost}
            footer={() => {
                return (
                    <>
                        <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={handleOk} style={{marginRight: 8}}>

                            Export Host
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Close
                        </Button>
                    </>
                )
            }}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p>Export host to XML: Noted password are not included</p>
                <Table
                    rowKey="key"
                    size="large"
                    columns={columns} bordered pagination={false}
                       rowSelection={rowSelection}
                       dataSource={dataSource}/>
            </div>
        </Modal>
    );
};

