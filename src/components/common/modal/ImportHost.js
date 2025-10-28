import React, {useEffect, useState} from "react";
import {Button, Input, message, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setExportHost, setImportHost} from "@/state/dialogSlice";
import {nanoid} from "nanoid";
import xml2js from "xml2js";
import {createServerFormat, setLocalStorage} from "@/utils/storage";
import {setServer} from "@/state/serverSlice";


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

    const {servers} = useSelector(state => state);
    const {importHost} = useSelector(state => state.dialog);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const dispatch = useDispatch();
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileName(e.target.value); // display filename in readonly input
            handleParse(selectedFile)
        }
    };

    const handleParse = (file) => {
        if (!file) {
            Modal.warning({
                title: "Error",
                content: "File not correct format",
                okText: "Close"
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            xml2js.parseString(text, { explicitArray: false }, (err, result) => {
                if (err) {
                    Modal.warning({
                        title: "Error",
                        content: "Cannot parse file",
                        okText: "Close"
                    });
                } else {
                    let hostsArray = []
                    if(Array.isArray(result.hosts.host)){
                        hostsArray = result.hosts.host.map(h => ({...h.$, key: nanoid(4)}));
                    }else{
                        hostsArray = [{...result.hosts.host.$, key: nanoid(4)}];
                    }
                    const uniqueServer = hostsArray.filter(h => {

                        return !servers.some(res => res.title === h.name)
                    });
                    if(uniqueServer.length !== hostsArray.length) {
                        message.warning("Has duplicate server");
                    }
                    setDataSource(uniqueServer);
                }
            });
        };
        reader.readAsText(file);
    };


    const handleOk = async () => {
        let saveObject = []
        for(let key of selectedRowKeys) {
            const server = dataSource.find(item => item.id === key)
            saveObject.push(createServerFormat({
                name: server.name,
                port: server.port,
                host: server.address,
                id: server.user
            }))
        }

        dispatch(setServer([...servers, ...saveObject]))
        setLocalStorage("connections", [...servers, ...saveObject]);
        handleClose()
    };

    const handleClose = () => {
        dispatch(setImportHost(false));
        setSelectedRowKeys([]);
        setFileName("")
        setDataSource([])
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {

            setSelectedRowKeys(keys);
        },
    };

    return (
        <Modal
            title="Import Host"
            open={importHost}
            footer={() => {
                return (
                    <>
                        <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={handleOk} style={{marginRight: 8}}>

                            Import Host
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
                <p>Import hosts from xml</p>
                <div style={{display: "flex", justifyContent: "space-between", gap: "10px", margin: "10px 0"}}>
                    {/*<Input readOnly={true}></Input>*/}
                    {/*<Upload beforeUpload={(e)=>{console.log(e)}} accept=".xml">*/}
                    {/*    <Button icon={<UploadOutlined />}>Upload XML</Button>*/}
                    {/*</Upload>*/}
                    <Input
                        placeholder="Select XML file"
                        value={fileName}
                        readOnly
                        style={{ marginBottom: 10 }}
                    />
                    <input
                        type="file"
                        id="fileInput"
                        accept=".xml"
                        style={{ display: "none" }}
                        value={fileName}
                        onChange={handleFileChange}
                    />
                    <Button type="primary" onClick={() => document.getElementById("fileInput").click()}>
                        Parse XML
                    </Button>
                </div>

                <Table
                    rowKey="id"
                    size="large"
                    columns={columns} bordered pagination={false}
                    rowSelection={rowSelection}
                    dataSource={dataSource}/>
            </div>
        </Modal>
    );
};

