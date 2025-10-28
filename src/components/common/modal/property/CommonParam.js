import {Button, Checkbox, Col, Divider, Form, Input, Radio, Row, Select, Space, Tabs} from "antd";
import styles from '@/components/ui/dialogs/dialog.module.css'
import React, {useContext, useEffect, useRef, useState} from "react";
import setData from "lodash/_setData";
import {setLoading, setProperty} from "@/state/dialogSlice";
import {getCubridConfig, setCubridConfig} from "@/utils/api";
import {useDispatch, useSelector} from "react-redux";
import {getAPIParam, getExtractConfig, parseBoolean, replaceConfig, replaceLine, replaceLines} from "@/utils/utils";
import {value} from "lodash/seq";
import TabPane from "antd/es/tabs/TabPane";
import {nanoid} from "nanoid";
import EditableTable from "@/components/ui/tables/EditableTable";

const defaultConfig = {
    error_log_level: "notification",
    error_log_warning: "n",
    error_log_size: 536870912,
    error_log: "server/demodb_20250612_0135.err",
    access_ip_control: "n",
    access_ip_control_file: "",
    sort_buffer_pages: 128,
    sort_buffer_size: 2,
    data_buffer_pages: 32768,
    data_buffer_size: 512,
    unfill_factor: 0.1,
    index_unfill_factor: 0.05,
    index_scan_oid_buffer_pages: 4,
    index_scan_oid_buffer_size: 64,
    index_scan_in_oid_order: "n",
    temp_file_max_size_in_pages: -1,
    lock_escalation: 100000,
    rollback_on_lock_escalation: "n",
    lock_timeout_in_secs: -1,
    lock_timeout: -1,
    deadlock_detection_interval_in_secs: 1,
    log_buffer_pages: 16384,
    log_buffer_size: 256,
    checkpoint_every_npages: 100000,
    checkpoint_every_size: 1.5,
    checkpoint_interval_in_mins: 6,
    checkpoint_interval: 360,
    background_archiving: "y",
    isolation_level: "tran_rep_class_commit_instance",
    commit_on_shutdown: "n",
    csql_auto_commit: "y",
    garbage_collection: "n",
    cubrid_port_id: 1523,
    connection_timeout: 5,
    optimization_level: 1,
    max_clients: 100,
    thread_stacksize: 1,
    db_hosts: "",
    backup_volume_max_size_bytes: 0,
    pthread_scope_process: "y",
    temp_file_memory_size_in_pages: 4,
    index_scan_key_buffer_pages: 20,
    index_scan_key_buffer_size: 320,
    dont_reuse_heap_file: "n",
    communication_histogram: "n",
    page_flush_interval_in_msecs: 1000,
    page_flush_interval: 1,
    adaptive_flush_control: "y",
    max_flush_pages_per_second: 10000,
    max_flush_size_per_second: 156.2,
    sync_on_nflush: 200,
    sync_on_flush_size: 3.1,
    ansi_quotes: "y",
    default_week_format: 0,
    only_full_group_by: "n",
    pipes_as_concat: "y",
    mysql_trigger_correlation_names: "n",
    require_like_escape_character: "n",
    no_backslash_escapes: "y",
    group_concat_max_len: 1,
    string_max_size_bytes: 1,
    add_column_update_hard_default: "n",
    return_null_on_function_errors: "n",
    alter_table_change_type_strict: "y",
    compactdb_page_reclaim_only: 0,
    plus_as_concat: "y",
    oracle_style_empty_string: "n",
    call_stack_dump_on_error: "n",
    call_stack_dump_activation_list: "-2,-7,-13,-14,-17,-19,-21,-22,-45,-46,-48,-50,-51,-52,-76,-78,-79,-81,-90,-96,-97,-313,-314,-407,-415,-416,-417,-583,-603,-836,-859,-890,-891,-976,-1040,-1075,-1131,-1084",
    call_stack_dump_deactivation_list: "",
    compat_numeric_division_scale: "n",
    auto_restart_server: "yes",
    max_plan_cache_entries: 1000,
    max_plan_cache_clones: 1000,
    plan_cache_timeout: -1,
    plan_cache_logging: "n",
    max_filter_pred_cache_entries: 1000,
    max_query_cache_entries: 0,
    query_cache_size_in_pages: 0,
    use_orderby_sort_limit: "y",
    ha_mode: "off",
    ha_mode_for_sa_utils_only: "off",
    ha_node_list: "85e5f7715c98@85e5f7715c98",
    ha_replica_list: "",
    ha_db_list: "",
    ha_copy_log_base: "",
    ha_copy_sync_mode: "",
    ha_apply_max_mem_size: 500,
    ha_port_id: 59901,
    ha_unacceptable_proc_restart_timediff: 120,
    ha_ping_hosts: "",
    ha_applylogdb_retry_error_list: "",
    ha_applylogdb_ignore_error_list: "",
    ha_enable_sql_logging: "n",
    ha_sql_log_max_size_in_mbytes: 50,
    ha_copy_log_max_archives: 1,
    ha_copy_log_timeout: 5,
    ha_replica_delay: 0,
    ha_replica_time_bound: "",
    ha_delay_limit: 0,
    ha_delay_limit_delta: 0,
    ha_applylogdb_max_commit_interval_in_msecs: 500,
    ha_applylogdb_max_commit_interval: 500,
    ha_check_disk_failure_interval: 15,
    compat_primary_key: "n",
    async_commit: "n",
    group_commit_interval_in_msecs: 0,
    intl_mbs_support: "n",
    log_compress: "y",
    block_nowhere_statement: "n",
    block_ddl_statement: "n",
    csql_history_num: 50,
    error_log_production_mode: "y",
    tcp_keepalive: "y",
    csql_single_line_mode: "n",
    log_max_archives: 0,
    force_remove_log_archives: "y",
    temp_volume_path: "",
    volume_extension_path: "",
    event_handler: "",
    event_activation_list: "",
    service__service: "server,broker,manager",
    service__server: "db_test",
    session_state_timeout: 21600,
    multi_range_optimization_limit: 100,
    intl_number_lang: "",
    intl_date_lang: "",
    compat_mode: "cubrid",
    db_volume_size: 512,
    log_volume_size: 512,
    unicode_input_normalization: "n",
    unicode_output_normalization: "n",
    intl_check_input_string: "n",
    check_peer_alive: "both",
    sql_trace_slow_msecs: -1,
    sql_trace_slow: -1,
    sql_trace_execution_plan: "n",
    log_trace_flush_time: 0,
    intl_collation: "",
    sort_limit_max_count: 1000,
    sql_trace_ioread_pages: 0,
    query_trace: "n",
    query_trace_format: "text",
    update_use_attribute_references: "n",
    data_aout_ratio: 0,
    max_agg_hash_size: 2,
    agg_hash_respect_order: "y",
    max_hash_list_scan_size: 8,
    lru_hot_ratio: 0.4,
    lru_buffer_ratio: 0.05,
    vacuum_master_interval_in_msecs: 10,
    vacuum_log_block_pages: 31,
    vacuum_worker_count: 10,
    timezone: "",
    server_timezone: "UTC",
    tz_leap_second_support: "n",
    data_buffer_neighbor_flush_nondirty: "n",
    data_buffer_neighbor_flush_pages: 8,
    ha_repl_filter_type: "none",
    ha_repl_filter_file: "",
    extended_statistics_activation: 15,
    enable_string_compression: "y",
    xasl_cache_time_threshold_in_minutes: 360,
    num_private_chains: -1,
    cte_max_recursions: 2000,
    json_max_array_idx: 65536,
    thread_connection_pooling: "y",
    thread_connection_timeout_seconds: 300,
    thread_worker_pooling: "y",
    thread_worker_timeout_seconds: 300,
    double_write_buffer_size: 2097152,
    data_file_os_advise: 0,
    loaddb_worker_count: 8,
    tde_keys_file_path: "",
    tde_default_algorithm: "aes",
    java_stored_procedure: "no",
    java_stored_procedure_port: 0,
    java_stored_procedure_jvm_options: "",
    java_stored_procedure_uds: "y",
    allow_truncated_string: "n",
    create_table_reuseoid: "y",
    use_stat_estimation: "n",
    ddl_audit_log: "n",
    ddl_audit_log_size: 10,
    supplemental_log: 0,
    recovery_progress_logging_interval: 0,
    thread_core_count: 2,
    flashback_timeout: 300,
    use_user_hosts: "n",
    max_query_per_tran: 100,
    regexp_engine: "re2",
    oracle_compat_number_behavior: "n",
    ha_tcp_ping_hosts: "",
    ha_sql_log_path: "",
    vacuum_ovfp_check_duration: 45000,
    vacuum_ovfp_check_threshold: 1000,
    deduplicate_key_level: -1,
    print_index_detail: "n",
    ha_sql_log_max_count: 2
}
const advanceParam = [
    {
        parameterName: "access_ip_control",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "access_ip_control_file",
        parameterType: "server",
        valueType: "string",
        parameterValue: "",
        input: { type: "text" }
    },
    {
        parameterName: "async_commit",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "backup_volume_max_size_bytes",
        parameterType: "server",
        valueType: "int(v>=32*1024)",
        parameterValue: "-1",
        input: { type: "number" }
    },
    {
        parameterName: "block_ddl_statement",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "block_nowhere_statement",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "call_stack_dump_activation_list",
        parameterType: "client,server",
        valueType: "string",
        parameterValue: "",
        input: { type: "text" }
    },
    {
        parameterName: "call_stack_dump_on_error",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "compatdb_page_reclaim_only",
        parameterType: "utility only",
        valueType: "int",
        parameterValue: "0",
        input: { type: "number" }
    },
    {
        parameterName: "compat_numeric_division_scale",
        parameterType: "client,server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "compat_primary_key",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "csql_history_num",
        parameterType: "client",
        valueType: "int(v>=1&&v<=200)",
        parameterValue: "50",
        input: { type: "number", min: "1", max: "200" }
    },
    {
        parameterName: "db_hosts",
        parameterType: "client",
        valueType: "string",
        parameterValue: "",
        input: { type: "text" }
    },
    {
        parameterName: "dont_reuse_heap_file",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "error_log",
        parameterType: "client,server",
        valueType: "string",
        parameterValue: "cubrid.err",
        input: { type: "text" }
    },
    {
        parameterName: "file_lock",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "yes",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "garbage_collection",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "group_commit_interval_in_msecs",
        parameterType: "server",
        valueType: "int(v>=0)",
        parameterValue: "0",
        input: { type: "number" }
    },
    {
        parameterName: "ha_mode",
        parameterType: "server",
        valueType: "string(on|off|yes|no|replica)",
        parameterValue: "off",
        input: { type: "text" }
    },
    {
        parameterName: "hostvar_late_binding",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "index_scan_in_oid_order",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "index_scan_oid_buffer_size",
        parameterType: "server",
        valueType: "int(v>=64*1024)",
        parameterValue: "64*1024",
        input: { type: "number" }
    },
    {
        parameterName: "insert_execution_mode",
        parameterType: "client",
        valueType: "int(v>=1&&v<=7)",
        parameterValue: "1",
        input: { type: "number", min: "1", max: "7" }
    },
    {
        parameterName: "intl_mbs_support",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "lock_timeout_message_type",
        parameterType: "server",
        valueType: "int(v>=0&&v<=2)",
        parameterValue: "0",
        input: { type: "number", min: "0", max: "2" }
    },
    {
        parameterName: "max_plan_cache_entries",
        parameterType: "client,server",
        valueType: "int",
        parameterValue: "1000",
        input: { type: "number" }
    },
    {
        parameterName: "max_query_cache_entries",
        parameterType: "server",
        valueType: "int",
        parameterValue: "-1",
        input: { type: "number" }
    },
    {
        parameterName: "media_failure_support",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "yes",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "oracle_style_empty_string",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "oracle_style_outerjoin",
        parameterType: "client",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "pthread_scope_process",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "yes",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "query_cache_mode",
        parameterType: "server",
        valueType: "int(v>=0&&v<=2)",
        parameterValue: "0",
        input: { type: "number", min: "0", max: "2" }
    },
    {
        parameterName: "query_cache_size_in_pages",
        parameterType: "server",
        valueType: "int",
        parameterValue: "-1",
        input: { type: "number" }
    },
    {
        parameterName: "single_byte_compare",
        parameterType: "server",
        valueType: "bool(yes|no)",
        parameterValue: "no",
        input: { type: "select", value: ["YES", "NO"] }
    },
    {
        parameterName: "temp_file_max_size_in_pages",
        parameterType: "server",
        valueType: "int",
        parameterValue: "-1",
        input: { type: "number" }
    },
    {
        parameterName: "temp_file_memory_size_in_pages",
        parameterType: "server",
        valueType: "int(v>=0&&v<=20)",
        parameterValue: "4",
        input: { type: "number", min: "0", max: "20" }
    },
    {
        parameterName: "temp_volume_path",
        parameterType: "server",
        valueType: "string",
        parameterValue: "100*1024",
        input: { type: "text" }
    }
]



let configBufferOption = {}
export default function (){
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const {servers} = useSelector(state => state);
    const {property} = useSelector(state => state.dialog);
    const [server, setServer] = useState({});
    const [originData, setOriginData] = useState([]);
    const [configProperty, setConfigProperty] = useState(defaultConfig);
    const [radio, setRadio] = useState({});
    const [checkBoxFields, setCheckBoxFields] = useState({})
    const handleChange = (key, value) => {
        setRadio(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCheckBox = (e) => {
        const {name, checked} = e.target;
        setCheckBoxFields(prevState => ({...prevState, [name]: checked}));
    }

    const getInitialize = async () => {
        const server = servers.find(res => res.serverId === property.node.serverId)
        setServer(server);
        dispatch(setLoading(true));
        const response = await getCubridConfig({...getAPIParam(server)});
        if(response.status){
            const lines = response.result.conflist[0].confdata
            setOriginData(lines)
            let extractData = getExtractConfig(lines)
            for(let key in extractData){
                if(!["java_stored_procedure", "auto_restart_server"].includes(key)){
                    extractData[key] = parseFloat(extractData[key])
                }
                switch (key) {
                    case "data_buffer_pages":
                        configBufferOption = {...configBufferOption, data: 1}
                        break
                    case "data_buffer_size":
                        configBufferOption = {...configBufferOption, data: 2}
                        break
                    case "sort_buffer_pages":
                        configBufferOption = {...configBufferOption, sort: 1}
                        break
                    case "sort_buffer_size":
                        configBufferOption = {...configBufferOption, sort: 2}
                        break
                    case "log_buffer_pages":
                        configBufferOption = {...configBufferOption, log: 1}
                        break
                    case "log_buffer_size":
                        configBufferOption = {...configBufferOption, log: 2}
                }
            }
            setRadio(configBufferOption)
            const checkBoxValue = {
                "auto_restart_server": extractData["auto_restart_server"] === "yes",
                "java_stored_procedure": extractData["java_stored_procedure"] === "yes"
            }
            setCheckBoxFields(checkBoxValue)

            setConfigProperty({...configProperty, ...extractData, ...checkBoxValue})
            form.setFieldsValue(defaultConfig)
            form.setFieldsValue(extractData)

        }
    }

    const onSave = async (data) => {
        form.validateFields().then(async (values) => {
            let val = {} // clone to avoid mutating `values`
            let finalValue = {}
            let buffer = {}
            if (radio.data === 1) {
                if(radio.data === configBufferOption.data) {
                    buffer["data_buffer_pages"] = `data_buffer_pages=${values["data_buffer_pages"]}`;
                }else{
                    buffer["data_buffer_size"] = `data_buffer_pages=${values["data_buffer_pages"]}`;
                }
            } else {
                if(radio.data === configBufferOption.data) {
                    buffer["data_buffer_size"] = `data_buffer_size=${values["data_buffer_size"]}MB`;
                }else{
                    buffer["data_buffer_pages"] = `data_buffer_size=${values["data_buffer_size"]}MB`;
                }
            }
            if (radio.sort === 1) {
                if(radio.sort === configBufferOption.sort) {
                    buffer["sort_buffer_pages"] = `sort_buffer_pages=${values["sort_buffer_pages"]}`;
                }else{
                    buffer["sort_buffer_size"] = `sort_buffer_pages=${values["sort_buffer_pages"]}`;
                }
            } else {
                if(radio.sort === configBufferOption.sort) {
                    buffer["sort_buffer_size"] = `sort_buffer_size=${values["sort_buffer_size"]}MB`;
                }else{
                    buffer["sort_buffer_pages"] = `sort_buffer_size=${values["sort_buffer_size"]}MB`;
                }
            }

            if (radio.log === 1) {
                if(radio.log === configBufferOption.log) {
                    buffer["log_buffer_pages"] = `log_buffer_pages=${values["log_buffer_pages"]}`;
                }else{
                    buffer["log_buffer_size"] = `log_buffer_pages=${values["log_buffer_pages"]}`;
                }
            } else {
                if(radio.log === configBufferOption.log) {
                    buffer["log_buffer_size"] = `log_buffer_size=${values["log_buffer_size"]}MB`;
                }else{
                    buffer["log_buffer_pages"] = `log_buffer_size=${values["log_buffer_size"]}MB`;
                }
            }
            let newLines = replaceLines(originData, buffer)
            for (const key in values) {
                const value = values[key];
                const original = configProperty[key];

                // Exclude "buffer", check value exists, and is different from default

                if (!key.includes("buffer") && value !== undefined && value !== original) {
                    finalValue[key] = value;
                 }
            }
            if(checkBoxFields.auto_restart_server !== configProperty.auto_restart_server){
                finalValue["auto_restart_server"] = parseBoolean(checkBoxFields.auto_restart_server);
            }
            if(checkBoxFields.java_stored_procedure !== configProperty.java_stored_procedure){
                finalValue["java_stored_procedure"] = parseBoolean(checkBoxFields.java_stored_procedure);
            }
            console.log(finalValue)
            newLines = replaceConfig(newLines, finalValue)
            dispatch(setLoading(true))
            const response = await setCubridConfig({...getAPIParam(server), confdata: newLines})
            if(response.status){
                await getInitialize()
            }
            dispatch(setLoading(false))

        })
    }

    useEffect(() => {
        getInitialize().
        then(r => dispatch(setLoading(false)) )
    },[])
    return (
        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: "8px" }}>

            <Tabs defaultActiveKey="1">
                <TabPane tab="General" key="1">
                    <Form form={form}>
                        <div className={styles.db__layout}>
                            <div className={"border__text"}>General Param</div>
                            <div className={styles.db__layout}>
                                <div className={"border__text"}>Data Buffer (MB)</div>
                                <Radio.Group style={{width: '100%'}}
                                             onChange={e=>handleChange("data",e.target.value)}
                                             value={radio.data}>
                                    <Row gutter={[0, 6]}>
                                        {/*<Col span={5} className={"col__center"}>*/}
                                        {/*    <Radio value={1}>data buffer pages</Radio>*/}
                                        {/*</Col>*/}
                                        {/*<Col span={19}>*/}
                                        {/*    <Form.Item name="data_buffer_pages">*/}
                                        {/*        <Input disabled={radio.data !== 1} type={"number"}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*</Col>*/}
                                        <Col span={5} className={"col__center"}>
                                            <Radio value={2}>data buffer size</Radio>
                                        </Col>
                                        <Col span={19}>
                                            <Form.Item name="data_buffer_size">
                                                <Input disabled={radio.data !== 2} type={"number"}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                            </div>

                            <div className={styles.db__layout}>
                                <div className={"border__text"}>Sort Buffer (MB)</div>
                                <Radio.Group style={{width: '100%'}}
                                             onChange={e=>handleChange("sort",e.target.value)}
                                             value={radio.sort}>
                                    <Row gutter={[0, 6]}>
                                        {/*<Col span={5} className={"col__center"}>*/}
                                        {/*    <Radio value={1}>sort buffer pages</Radio>*/}
                                        {/*</Col>*/}
                                        {/*<Col span={19}>*/}
                                        {/*    <Form.Item name="sort_buffer_pages">*/}
                                        {/*        <Input disabled={radio.sort !== 1}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*</Col>*/}
                                        <Col span={5} className={"col__center"}>
                                            <Radio value={2}>sort buffer size</Radio>
                                        </Col>
                                        <Col span={19}>
                                            <Form.Item name="sort_buffer_size">
                                                <Input disabled={radio.sort !== 2}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                            </div>


                            <div className={styles.db__layout}>
                                <div className={"border__text"}>Log Buffer (MB)</div>
                                <Radio.Group style={{width: '100%'}}
                                             onChange={e=>handleChange("log",e.target.value)}
                                             value={radio.log}>
                                    <Row gutter={[0, 6]}>
                                        {/*<Col span={5} className={"col__center"}>*/}
                                        {/*    <Radio value={1}>log buffer pages</Radio>*/}
                                        {/*</Col>*/}
                                        {/*<Col span={19}>*/}
                                        {/*    <Form.Item name="log_buffer_pages">*/}
                                        {/*        <Input disabled={radio.log !== 1}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*</Col>*/}
                                        <Col span={5} className={"col__center"}>
                                            <Radio value={2}>log buffer size</Radio>
                                        </Col>
                                        <Col span={19}>
                                            <Form.Item name="log_buffer_size">
                                                <Input disabled={radio.log !== 2}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                            </div>

                            <div className={styles.db__layout}>
                                <div className={"border__text"}>Other</div>
                                <Row >
                                    <Col span={24}>
                                        <Form.Item
                                            labelCol={{span: 9}}
                                            label={"lock_escalation"}
                                            name="lock_escalation">
                                            <Input rootClassName={"small__input"}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"lock_timeout_in_secs"}
                                            labelCol={{span: 9}}
                                            name="lock_timeout_in_secs">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"deadlock_detection_interval_in_secs"}
                                            labelCol={{span: 9}}
                                            name="deadlock_detection_interval_in_secs">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"checkpoint_interval_in_mins"}
                                            labelCol={{span: 9}}
                                            name="checkpoint_interval_in_mins">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"isolation_level"}
                                            labelCol={{span: 9}}
                                            name="isolation_level">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"cubrid_port_id"}
                                            labelCol={{span: 9}}
                                            name="cubrid_port_id">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"max_clients"}
                                            labelCol={{span: 9}}
                                            name="max_clients">
                                            <Input rootClassName={"small__input"} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Col span={24}>
                                    <Checkbox name="auto_restart_server"
                                              checked={checkBoxFields.auto_restart_server}
                                              onClick={handleCheckBox}>auto_restart_server</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox name="java_stored_procedure"
                                              checked={checkBoxFields.java_stored_procedure}
                                              onClick={handleCheckBox}>java_stored_procedure</Checkbox>
                                </Col>

                            </div>
                        </div>
                    </Form>

                    <Divider style={{margin: "6px 0"}}/>

                    <div style={{display: "flex", justifyContent: "flex-end", gap: 12, padding: "12px 0"}}>
                        <Button type={"primary"}  className={"button__width__80"}
                                onClick={onSave}
                        >Save</Button>
                        <Button type={"primary"}
                                className={"button__width__80"}
                                onClick={()=>{
                                    dispatch(setProperty({open: false}))
                                }}
                        >Close</Button>
                    </div>
                </TabPane>
                <TabPane tab="Advance" key="2">
                    <EditableTable />
                </TabPane>

            </Tabs>
        </div>
    )
}