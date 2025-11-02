import React, {useEffect, useState} from "react";
import {Button, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {setExportHost} from "@/store/dialogReducer";


const columns =  [
    {
        title: 'Host Name',
        dataIndex: 'alias',
        key: 'alias',
    },
    {
        title: 'Host Port',
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: 'Host Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'User Name',
        dataIndex: 'user',
        key: 'user',
    },
]



export default function (){

    const {servers} = useSelector(state => state.treeReducer);
    const {exportHost} = useSelector(state => state.dialog);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const dispatch = useDispatch();
    const [fileName, setFileName] = useState("hosts.xml");

    const buildContent = ()=>{
        let content = ``
        for(let key of selectedRowKeys){
            let server = servers.find(res=>res.serverId===key)
            content += `\t<host address="${server.address}" jdbcDriver="Auto Detect" name="${server.title}" port="${server.port}" soTimeOut="10000" user="${server.id}"/>\n`
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
                alias: res.alias,
                port: res.port,
                address: res.address,
                user: res.id,
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

