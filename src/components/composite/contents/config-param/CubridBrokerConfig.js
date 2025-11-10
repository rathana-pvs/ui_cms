import React, { useState, useContext, useEffect, useRef } from 'react';
import { Table, Input, Form } from 'antd';
// import {getCubridBrokerConfig, setCubridBrokerConfig, setCubridConfig} from "@/utils/api";

import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {deleteContents, deleteSignalSavePanel, setActivePanel, setUnsavedPanels} from "@/store/generalReducer";
import {getAPIParam} from "@/utils/utils";
import ConfirmAction from "@/components/common/modal/ConfirmAction";
import {setLoading} from "@/store/dialogReducer";

// import './table.css'; // Custom styling

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = (props) => {
    const {
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    } = props;
    const form = useContext(EditableContext);
    const inputRef = useRef(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);


    const toggleEdit = (status) => {
        setEditing(status);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit(false);
            handleSave({ ...record, ...values });
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    let childNode = children;
    const isEmpty = !children || (typeof children[0] === 'string' && children[0].trim() === '');
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} size="small" />
            </Form.Item>
        ) : (

            <div
                onClick={() => toggleEdit(true)}
                style={{ minHeight: 24, padding: 0, cursor: 'pointer' }}
            >
                {isEmpty ? <span style={{ opacity: 0.4 }}>Click to edit</span> : children}
            </div>
        );


    return <td {...restProps}>{childNode}</td>;
};

const EditableTable = () => {

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
        // getCubridBrokerConfig({...getAPIParam(server)}).then((res) => {
        //     // if(res.status){
        //     //     const data = extractParam(res.result.conflist[0].confdata)
        //     //     const cols = Object.keys(data[0]).map(col=>{
        //     //         return {
        //     //             key: nanoid(4),
        //     //             title: col,
        //     //             editable: true,
        //     //             dataIndex: col.toLowerCase(),
        //     //         }
        //     //     });
        //     //     cols.unshift({
        //     //         key: nanoid(4),
        //     //         title: "Property Name",
        //     //         dataIndex: "propertyName",
        //     //     })
        //     //     setColumns(cols.map(col => ({
        //     //         ...col,
        //     //         onCell: col.editable
        //     //             ? (record) => ({
        //     //                 record,
        //     //                 editable: col.editable,
        //     //                 dataIndex: col.dataIndex,
        //     //                 title: col.title,
        //     //                 handleSave,
        //     //             })
        //     //             : undefined,
        //     //     })))
        //     //
        //     //     const values = [...data[1]].map(res=>{
        //     //     const brokers = Object.keys(data[0]).map(col=>{
        //     //             return {
        //     //                 key: nanoid(4),
        //     //                 [col]: data[0][col][res] ?? "",
        //     //             }
        //     //         })
        //     //         return {
        //     //             key: nanoid(4),
        //     //             propertyName: res,
        //     //             ...Object.assign({}, ...brokers)
        //     //         }
        //     //     });
        //     //     setDataSource(values)
        //     //     reserved = values;
        //     // }
        //
        // })
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

    useEffect(()=>{
        if(signalSavePanel.includes(activePanel)){
            ConfirmAction({
                content: "Do you want to save changes?",
                onOk: () => {
                    // dispatch(setLoading(true))
                    // const lines = injectParam(dataSource);
                    // setCubridBrokerConfig({...getAPIParam(server), confdata: lines}).then(res =>{
                    //     dispatch(setLoading(false))
                    //     if(res.status) {
                    //         removePanel()
                    //     }
                    // })

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
        <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowClassName={(_, index) => (index % 2 === 0 ? 'striped' : '')}
            pagination={false}
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            className="custom-table"
        />
    );
};

export default EditableTable;
