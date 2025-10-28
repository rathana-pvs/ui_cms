import React, { useState, useContext, useEffect, useRef } from 'react';
import {Table, Input, Form, FloatButton} from 'antd';
import {getCubridBrokerConfig, getCubridConfig, setCubridBrokerConfig, setCubridConfig} from "@/utils/api";
import {extractParam, getAPIParam, injectParam, injectPram} from "@/utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {col, data} from "framer-motion/m";
import ConfirmAction from "@/components/ui/dialogs/ConfirmAction";
import {setLoading} from "@/state/dialogSlice";
import {deleteContents, deleteSignalSavePanel, setActivePanel, setUnsavedPanels} from "@/state/generalSlice";
import EditableTable from "@/components/ui/tables/EditableTable";
import {SaveOutlined} from "@ant-design/icons";



export default function (){

    const {contents, activePanel, unsavedPanels, signalSavePanel} = useSelector(state => state.general);
    const dispatch = useDispatch()
    const [server, setServer] = useState({})
    const {servers} = useSelector(state => state);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [isChange, setIsChange] = useState(false);
    let reserved = []

    const handleChange = (value)=>{
        setIsChange(true)

    }
    useEffect(()=>{
        if(isChange){
            dispatch(setUnsavedPanels([...unsavedPanels, activePanel]))
        }
    },[isChange])
    useEffect(()=>{
        const content = contents.find(res => res.key === activePanel)
        const server = servers.find(res => res.serverId === content.serverId)
        setServer(server);
        getCubridConfig({...getAPIParam(server)}).then((res) => {
            if(res.status){
                const data = extractParam(res.result.conflist[0].confdata)
                const host = {
                    key: nanoid(4),
                    propertyName: "Host"
                }
                const section = {key: nanoid(4), propertyName: "Section"};

                const cols = Object.keys(data[0]).map((col, index)=>{
                    section[col] = `[${col}]`;
                    host[col] = server.title;
                    return {
                        key: nanoid(4),
                        title: `Section ${index + 1}`,
                        editable: true,
                        dataIndex: col,
                    }
                });
                cols.unshift({
                    key: nanoid(4),
                    title: "Property Name",
                    dataIndex: "propertyName",
                })
                const tempData = cols.map(col => ({
                    ...col,
                    onCell: col.editable
                        ? (record) => ({
                            record,
                            editable: col.editable,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            handleSave,
                        })
                        : undefined,
                }))
                setColumns([...tempData]);

                const values = [...data[1]].map(res=>{
                    const brokers = Object.keys(data[0]).map(col=>{
                        return {
                            key: nanoid(4),
                            [col]: data[0][col][res] ?? "",
                        }
                    })
                    return {
                        key: nanoid(4),
                        propertyName: res,
                        ...Object.assign({}, ...brokers)
                    }
                });
                const finalData = [host, section, ...values]
                setDataSource(finalData);
                reserved = finalData;
            }

        })
    },[])

    const handleSave = (row) => {
        setIsChange(true)
        const newData = reserved.map(res=>{
            if(res.key === row.key){
                return row
            }
            return res
        })
        reserved = newData
        setDataSource(newData)

    };
    const handleSaveConfig = ()=>{
        dispatch(setLoading(true))
        removePanel()
        // console.log(lines);
        dispatch(setLoading(false))
        // const lines = injectParam(
        //     dataSource.filter(res => !["Host", "Section"].includes(res.propertyName))
        // );
        // setCubridConfig({...getAPIParam(server), confdata: lines}).then(res =>{
        //     dispatch(setLoading(false))
        //     if(res.status) {
        //         removePanel()
        //     }
        // }).catch(err=>{
        //     dispatch(setLoading(false))
        // })
    }

    useEffect(()=>{
        if(signalSavePanel.includes(activePanel)){
            ConfirmAction({
                content: "Do you want to save changes?",
                onOk: () => {
                    handleSaveConfig()

                },
                onCancel: () => {
                    removePanel()
                }
            })
        }
    },[signalSavePanel])

    const removePanel = ()=>{
        if(contents.length > 1) {
            const activeKey = contents.at(-2).key;
            dispatch(setActivePanel(activeKey));
        }
        dispatch(deleteContents(activePanel));
        dispatch(deleteSignalSavePanel(activePanel));
    }
    console.log(dataSource)

    return (
        // <Table
        //     bordered
        //     dataSource={dataSource}
        //     columns={columns}
        //     rowClassName={(_, index) => (index % 2 === 0 ? 'striped' : '')}
        //     pagination={false}
        //     components={{
        //         body: {
        //             row: EditableRow,
        //             cell: EditableCell,
        //         },
        //     }}
        //     className="custom-table"
        // />

        <>
            <EditableTable columns={columns} dataSource={dataSource}/>
            {isChange? <FloatButton
                icon={<SaveOutlined />}
                tooltip="Save"
                onClick={handleSaveConfig}
                type="primary"
            />:""}

        </>
    );
};

