import React, {useEffect, useState} from "react";
import {Modal, Form, Select, Button, Row, Input, Col, Checkbox, Radio} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCreateDB, setLoading, setOptimizeDB} from "@/state/dialogSlice";
import styles from "@/components/ui/dialogs/dialog.module.css"
import {
    getCheckDir,
    getCheckFile,
    getCreateDB, getCubridConfig,
    getOptimizeDB,
    getTables, getVersion,
    setAutoAddVol,
    setCubridConfig, startDatabase, updateUser, updateUserDB
} from "@/utils/api";
import {getAPIParam, isEmptyString, isNotEmpty, replaceConfig, replaceLines} from "@/utils/utils";
import EditableTable from "@/components/ui/tables/EditableTable";
import {nanoid} from "nanoid";
import * as Yup from "yup";
import {isEmpty} from "lodash";
import {refreshDatabases} from "@/utils/ui-refresh";

const collations = [
    "en_US.iso88591",
    "ko_KR.utf8",
    "en_US.utf8",
    "User Defined",
    "ko_KR.euckr",
];

const validation = [
    Yup.object().shape({
        dbname: Yup.string().required("dbname required"),
    }),
    false,
    Yup.object().shape({
        data_warn_outofspace: Yup.number().required("required"),
        data_ext_page: Yup.number().required("required"),
        index_warn_outofspace: Yup.number().required("required"),
        index_ext_page: Yup.number().required("required"),
    })
]

function getNumPage(totalSize, pageSize){
    return (totalSize * 1048576) / pageSize

}

export default function (){

    const {servers, databases} = useSelector(state => state);
    const {createDB} = useSelector(state => state.dialog);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [pageId, setPageId] = useState(0);
    const [db, setDB] = useState({})
    const [dbname, setDBName] = useState("");
    const [autoStart, setAutoStart] = useState(false)
    const [exvol, setExvol] = useState([]);
    const [addVol, setAddVol] = useState({});
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [newVersion, setNewVersion] = useState(false)



    const [addVolCheck, setAddVolCheck] = useState({
        data: false,
        index: false
    })
    const handleOk = async () => {

    };

    const columns = [
        {
            title: "Volume Name",
            dataIndex: "volume_name",
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'volume_name',
                title: 'Volume Name',
                handleSave,
                cellProps: {
                    type: 'text',
                }
            }),
            key: nanoid(4),

        },
        {
            title: "Volume Type",
            dataIndex: "volume_type",
            key: nanoid(4),
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'volume_type',
                title: 'Volume Type',
                cellProps: {
                    type: 'select', list: ["data", "index", "temp", "generic"]
                },
                handleSave,
            }),
        },
        {
            title: "Volume Size (Mbyte)",
            dataIndex: "volume_size",
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'volume_size',
                title: 'Volume Size (Mbyte)',
                cellProps: {
                    type: 'number'
                },
                handleSave,
            }),
            key: nanoid(4),

        },
        {
            title: "Volume Path",
            dataIndex: "volume_path",
            key: nanoid(4)
        },

    ]

    const handleSave = (row)=>{
        const newData = exvol.map(res=>{
            if(res.key === row.key){
                return row
            }
            return res
        })
        setExvol(newData)
    }
    const handleCreate = async () => {
        dispatch(setLoading(true))
        const server = servers.find(res => res.serverId === createDB.node.serverId);
        const checkDir = await getCheckDir({...getAPIParam(server), dir: db.genvolpath});
        if(checkDir.result.noexist){
            const file = exvol.map(res=>{
                return res.volume_path
            })
            const checkFile = await getCheckFile({...getAPIParam(server), file});
            if(checkFile.status){
                const data = {
                    ...db,
                    numpage: getNumPage(db.db_volume_size, db.pagesize),
                    logsize: db.logsize * 64,
                    dbname,
                    exvol: exvol.map(res=>{
                        return {
                            [res.volume_name]: `${res.volume_type};${res.volume_size * 64};${res.volume_path}`
                        }
                    }),
                    overwrite_config_file: "NO",

                }
                const creatDBResponse =  await getCreateDB({...getAPIParam(server), ...data})

                if(creatDBResponse.status){
                    const addVolData = {
                        ...addVol,
                        dbname,
                        data: addVolCheck.data ? "ON": "OFF",
                        index: addVolCheck.index ? "ON" : "OFF"
                    }
                    const addVolResponse = await setAutoAddVol({...getAPIParam(server), ...addVolData})

                    if(addVolResponse.status){
                        // const getParam = await getCubridConfig({...getAPIParam(server)})
                        // const replaceLine = replaceConfig(getParam.result.conflist[0].confdata, {
                        //     db_volume_size: `${db.db_volume_size}M`,
                        //     log_volume_size: `${db.logsize}M`
                        // })
                        // const setParam = await setCubridConfig({...getAPIParam(server), confdata: replaceLine})
                        await startDatabase({...getAPIParam(server), database: dbname})
                        const updateUserResponse = await updateUserDB({...getAPIParam(server),
                        dbname, username: "dba", userpass: form.getFieldValue("password"), authorization:[]

                        })


                        if(updateUserResponse.status){
                            await refreshDatabases(dispatch, databases, server, createDB.node)
                            dispatch(setCreateDB({open: false}))
                            Modal.info({
                                title: 'Success',
                                content: `Create Database Successfully`,
                                okText: 'Close',
                            })
                        }

                    }
                }


            }
            dispatch(setLoading(false))

        }else{
            dispatch(setLoading(false))
            Modal.error({
                title: 'Error',
                content: `${db.genvolpath} is already exist`,
                okText: 'Close',
            })
        }
    }


    useEffect(()=>{

        if(createDB.node){
            const server = servers.find(res => res.serverId === createDB.node.serverId);
            getVersion({...getAPIParam(server)}).then(res=>{
                if(res.status){
                    const shortVersion = res.result["CUBRIDVER"].match(/\d+\.\d+/)[0]
                    if(parseFloat(shortVersion) >= 10.2){
                        setNewVersion(true)
                    }
                }

            })
        }

    },[createDB.node])

    useEffect(() => {
        // dispatch(setCreateDB({open: true}))


        if(pageId === 0){
            form.setFieldsValue({
                genvolpath: `/home/cubrid/CUBRID/${dbname}`,
                logvolpath: `/home/cubrid/CUBRID/${dbname}`,
                charset: "en_US.iso88591",
                numpage:512,
                pagesize:16384,
                logsize:512,
                logpagesize:16384,
                db_volume_size: 512
            })
        }else if(pageId === 1){

            if(newVersion){
                setExvol([
                    {
                        volume_name: `${dbname}_data_x001`,
                        volume_type: "data",
                        volume_size: 512,
                        volume_path: `/home/cubrid/CUBRID/${dbname}`,
                        key: nanoid(4)
                    },
                    {
                        volume_name: `${dbname}_temp_x001`,
                        volume_type: "temp",
                        volume_size: 512,
                        volume_path: `/home/cubrid/CUBRID/${dbname}`,
                        key: nanoid(4)
                    }
                ])
            }else{
                setExvol([
                    {
                        volume_name: `${dbname}_data_x001`,
                        volume_type: "data",
                        volume_size: 512,
                        volume_path: `/home/cubrid/CUBRID/${dbname}`,
                        key: nanoid(4)
                    },
                    {
                        volume_name: `${dbname}_index_x001`,
                        volume_type: "index",
                        volume_size: 512,
                        volume_path: `/home/cubrid/CUBRID/${dbname}`,
                        key: nanoid(4)
                    },
                    {
                        volume_name: `${dbname}_temp_x001`,
                        volume_type: "temp",
                        volume_size: 512,
                        volume_path: `/home/cubrid/CUBRID/${dbname}`,
                        key: nanoid(4)
                    }
                ])
            }
            
            form.setFieldsValue({
                volume_name: `${dbname}_data_x002`,
                volume_type: "data",
                volume_size: 512,
                volume_path: `/home/cubrid/CUBRID/${dbname}`
            })
        }else if(pageId === 2){
            form.setFieldsValue({
                data_ext_page:"32768",
                index_ext_page:"32768",
                data_warn_outofspace: "0.15",
                index_warn_outofspace: "0.15"

            })
        }

    },[dbname, pageId])

    const handleAddVolume = ()=>{
        setExvol(prevState => [...prevState, form.getFieldsValue()])
    }

    const handleClose = () => {
        dispatch(setCreateDB({open: false}));
    }

    const handleAddVolCheckBox = (e)=>{
        const {name, checked} = e.target
        setAddVolCheck(prevState => ({...prevState, [name]: checked}))
    }


    const getPages = ()=>{
        if(pageId === 0){
            return <Row gutter={[12, 4]}>

                <div className={styles.db__layout}>
                    <div className="border__text">General</div>
                    <Col span={24}>
                        <Form.Item
                            label="Database"
                            name="dbname"
                            onChange={(e)=>{setDBName(e.target.value)}}
                            labelCol={{span: 5}}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Page Size"
                            name="pagesize"
                            labelCol={{span: 5}}
                        >
                            <Select>
                                <Select.Option value={4096}>4096</Select.Option>
                                <Select.Option value={8192}>8192</Select.Option>
                                <Select.Option value={16384}>16384</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                </div>


                <div className={styles.db__layout}>
                    <div className="border__text">Collation (Charset)</div>
                    <Col>
                        <Form.Item name="charset">
                            <Radio.Group>
                                <Row gutter={[16, 8]}>
                                    {collations.map((c, index) => (
                                        <Col span={8} key={c}>
                                            <Radio value={c}>{c}</Radio>
                                        </Col>
                                    ))}
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </div>

                <div className={styles.db__layout}>
                    <div className="border__text">General Volume Information</div>

                    <Col span={24}>
                        <Form.Item
                            label="Generic Volume Size"
                            name="db_volume_size"
                            labelCol={{span: 8}}
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Generic Volume Path"
                            name="genvolpath"
                            labelCol={{span: 8}}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </div>



                <div className={styles.db__layout}>
                    <div className="border__text">Log Volume Information</div>
                    <Col span={24}>
                        <Form.Item
                            label="Log page size (btye): "
                            name="logpagesize"
                            labelCol={{span: 8}}
                        >
                            <Select>
                                <Select.Option value={4096}>4096</Select.Option>
                                <Select.Option value={8192}>8192</Select.Option>
                                <Select.Option value={16384}>16384</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Volume size (Mbtye): "
                            name="logsize"
                            labelCol={{span: 8}}
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Log volume path: "
                            name="logvolpath"
                            labelCol={{span: 8}}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </div>

                <div className={styles.db__layout}>
                    <div className="border__text">Attribute</div>
                    <Checkbox name="autoStart" value={autoStart} onChange={e => setAutoStart(e.target.checked)}>Auto start database when start cubrid service</Checkbox>
                    <br/> Set the current database to start automatically when start cubrid service

                </div>
            </Row>
        }
        else if(pageId === 1){

            if(newVersion){
                return <Row gutter={[12, 4]}>
                    <div className={styles.db__layout}>
                        <div className="border__text">Additional Volume</div>
                        <Col span={24}>
                            <Form.Item
                                label="Volume Name"
                                name="volume_name"
                                labelCol={{span: 6}}
                            >
                                <Input readOnly={true}/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Volume Path"
                                name="volume_path"
                                labelCol={{span: 6}}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Volume Type"
                                name="volume_type"
                                labelCol={{span: 6}}
                            >
                                <Select>
                                    <Select.Option value="data">data</Select.Option>
                                    <Select.Option value="temp">temp</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Volume Size (Mbtye): "
                                name="volume_size"
                                labelCol={{span: 6}}
                            >
                                <Input readOnly={true}/>
                            </Form.Item>
                        </Col>
                        <Col style={{display:"flex", gap: 12, justifyContent: "end", padding: "12px 6px"}}>
                            <Button type="primary" onClick={handleAddVolume}>
                                Add Volume
                            </Button>
                            <Button type="primary" danger onClick={()=>{
                                setExvol(exvol.filter(res=>res.key !== selectedRowKey))
                            }}>
                                Delete Volume
                            </Button>
                        </Col>

                        <EditableTable columns={columns} dataSource={exvol}
                                       onRow={(record) => ({
                                           onClick: () => {
                                               setSelectedRowKey(record.key);

                                           },
                                       })}
                                       rowClassName={(record) =>
                                           record.key === selectedRowKey ? "row__selected" : ""
                                       }

                        />

                    </div>
                </Row>
            }

            return <Row gutter={[12, 4]}>
                <div className={styles.db__layout}>
                    <div className="border__text">Additional Volume</div>
                    <Col span={24}>
                        <Form.Item
                            label="Volume Name"
                            name="volume_name"
                            labelCol={{span: 6}}
                        >
                            <Input readOnly={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Volume Path"
                            name="volume_path"
                            labelCol={{span: 6}}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Volume Type"
                            name="volume_type"
                            labelCol={{span: 6}}
                        >
                            <Select>
                                <Select.Option value="data">data</Select.Option>
                                <Select.Option value="index">index</Select.Option>
                                <Select.Option value="temp">temp</Select.Option>
                                <Select.Option value="generic">generic</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Volume Size (Mbtye): "
                            name="volume_size"
                            labelCol={{span: 6}}
                        >
                            <Input readOnly={true}/>
                        </Form.Item>
                    </Col>
                    <Col style={{display:"flex", gap: 12, justifyContent: "end", padding: "12px 6px"}}>
                        <Button type="primary" onClick={handleAddVolume}>
                            Add Volume
                        </Button>
                        <Button type="primary" danger onClick={()=>{
                            setExvol(exvol.filter(res=>res.key !== selectedRowKey))
                        }}>
                            Delete Volume
                        </Button>
                    </Col>

                    <EditableTable columns={columns} dataSource={exvol}
                                   onRow={(record) => ({
                                       onClick: () => {
                                           setSelectedRowKey(record.key);

                                       },
                                   })}
                                   rowClassName={(record) =>
                                       record.key === selectedRowKey ? "row__selected" : ""
                                   }

                    />

                </div>
            </Row>
        }
        else if(pageId === 2){
            return <Row gutter={[12, 4]}>
                <div className={styles.db__layout}>
                    <div className="border__text">Volume Purpose: Data</div>
                    <Checkbox name="data" value={addVolCheck.data}
                    onClick={handleAddVolCheckBox}
                    >Create Volume Automatically when out of space</Checkbox>

                    <Col span={24}>
                        <Form.Item
                            label="Out of space warning level"
                            name="data_warn_outofspace"
                            labelCol={{span: 6}}
                        >
                            <Select>
                                {
                                    Array.from({ length: 26 }, (_, i) => {
                                        return <Select.Option key={i} value={(i+5)/100}>{i + 5}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Volume size (Mbyte)"
                            name="data_ext_page"
                            labelCol={{span: 6}}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                </div>

                <div className={styles.db__layout}>
                    <div className="border__text">Volume Purpose: Index</div>
                    <Checkbox name="index" value={addVolCheck.index}
                              onClick={handleAddVolCheckBox}
                    >Create Volume Automatically when out of space</Checkbox>
                    <Col span={24}>
                        <Form.Item
                            label="Out of space warning level"
                            name="index_warn_outofspace"
                            labelCol={{span: 6}}
                        >
                            <Select>
                                {
                                    Array.from({ length: 26 }, (_, i) => {
                                        return <Select.Option key={i} value={(i+5)/100}>{i + 5}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Volume size (Mbyte)"
                            name="index_ext_page"
                            labelCol={{span: 6}}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                </div>
            </Row>
        }else if(pageId === 3){
            return <Row gutter={[12, 4]}>
                <div className={styles.db__layout}>
                    <div className={"border__text"}>Set password</div>
                    <Form.Item
                        label="Password"
                        name="password"
                        hasFeedback
                        labelCol={{span: 6}}
                        rules={[{require: true}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        label="Confirm password"
                        name="confirm_password"
                        labelCol={{span: 6}}
                        dependencies={["password"]}
                        rules={[
                            {message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match"));
                                }
                            })
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                </div>
            </Row>
        }
    }

    const updateNextPage = async (counter) => {

        const index = pageId + counter
        if (index > -1 && index < 5) {
            if(counter === -1){
                setPageId(index)
            }else{
                const validate = validation[pageId]
                if (index === 1) {
                    validate.validate({...form.getFieldsValue()}).then(res => {
                        setDB(form.getFieldsValue())
                        setPageId(index);
                    })
                } else if (index === 3) {
                    setAddVol(form.getFieldsValue())
                    setPageId(index)
                } else if (index === 4) {
                    const {password, confirm_password} = form.getFieldsValue()
                    if (password === confirm_password) {
                        await handleCreate()
                    }
                } else {
                    setPageId(index)
                }
            }


        }
    }

    const isNext = ()=>{
        if(pageId === 0){
            setIsValid(!isEmptyString(form.getFieldValue("dbname")))
        }else if(pageId === 3){
            const {password, confirm_password} = form.getFieldsValue()
            setIsValid(password === confirm_password)
        }else{
            setIsValid(true)
        }

    }

    return (
        <Modal
            width={800}
            title="Create DB"
            open={createDB.open}
            footer={() => {
                return (
                    <>
                        <Button type="primary" onClick={()=>updateNextPage(-1)} >
                            Back
                        </Button>
                        <Button type="primary" disabled={!isValid} onClick={()=>updateNextPage(1)} >
                            Next
                        </Button>
                        <Button type="primary" onClick={handleOk}>
                            Finish
                        </Button>

                        <Button type={"primary"} variant={"filled"} className={"button button__small"}
                                onClick={() => handleClose()}>
                            Cancel
                        </Button>
                    </>
                )
            }}
        >
            <Form form={form} autoComplete="off" onFieldsChange={isNext} layout="horizontal">
                {getPages()}
            </Form>



        </Modal>
    );
};

