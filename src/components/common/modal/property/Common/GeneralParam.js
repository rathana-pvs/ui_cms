import {Button, Checkbox, Col, Divider, Form, Input, Radio, Row} from "antd";
import styles from "@/components/ui/dialogs/dialog.module.css";
import {setLoading, setProperty} from "@/state/dialogSlice";
import React, {useEffect, useState} from "react";
import {getCubridConfig, setCubridConfig} from "@/utils/api";
import {
    createConfigFile,
    extractConfig,
    getAPIParam,
    getExtractConfig, onStartService,
    onStopService,
    parseSize,
    replaceConfig
} from "@/utils/utils";
import {useDispatch, useSelector} from "react-redux";

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



export default function (){
    const [radio, setRadio] = useState({});
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const {servers} = useSelector(state => state);
    const {property} = useSelector(state => state.dialog);
    const [configProperty, setConfigProperty] = useState(defaultConfig);
    const [server, setServer] = useState({});
    const [checkbox, setCheckbox] = useState({});
    const [config, setConfig] = useState([])


    const onSave = () => {
        form.validateFields().then(async (values) => {
            let allValues = {...values, ...checkbox};
            let diff = {}
            for(let key in allValues){
                if(allValues[key] !== configProperty[key]){
                    diff[key] = allValues[key];
                    // if(key.includes("buffer_size")){
                    //     diff[key] = `${diff[key]}MB`;
                    // }
                }
            }
            let data = {...config}
            data["common"] = {...data["common"], ...diff}
            let file = createConfigFile(data)
            console.log(file)
            // let newLines = replaceConfig(config, diff)
            //
            dispatch(setLoading(true))
            const response = await setCubridConfig({...getAPIParam(server), confdata: file})
            if(response.status){
                await getInitialize()
                await onStopService(server, dispatch)
                await onStartService(server, dispatch)
            }
            dispatch(setLoading(false))

        })

    }

    const handleCheckBox = (e) => {
        const {name, checked} = e.target;
        setCheckbox(prevState => ({...prevState, [name]: checked ? "yes" : "no"}));
    }
    const handleChange = (key, value) => {
        setRadio(prev => ({
            ...prev,
            [key]: value,
        }));
    };


    const getInitialize = async () => {
        const server = servers.find(res => res.serverId === property.node.serverId)
        setServer(server);
        dispatch(setLoading(true));
        const response = await getCubridConfig({...getAPIParam(server)});
        if(response.status) {
            const lines = response.result.conflist[0].confdata
            const extracted = extractConfig(lines)
            setConfig(extracted)
            let extractData = getExtractConfig(lines)
            // for(let key in extractData){
            //     if(key.includes("buffer_size")){
            //         extractData[key] = parseSize(extractData[key]);
            //     }
            // }
            form.setFieldsValue({
                ...extractData,
            })
            setCheckbox(
                {auto_restart_server: extractData["auto_restart_server"],
                    java_stored_procedure: extractData["java_stored_procedure"]
                });
            setConfigProperty(prevState => ({...prevState, ...extractData}))
        }
    }

    useEffect(() => {
        form.setFieldsValue({...configProperty})
        getInitialize().
        then(r => dispatch(setLoading(false)) )
    },[])

    return (
        <div>
            <Form form={form} style={{maxHeight: 400, overflowY: 'auto'}}>
                <div className={styles.db__layout}>
                    <div className={"border__text"}>General Param</div>
                    <div className={styles.db__layout}>
                        <div className={"border__text"}>Data Buffer (MB)</div>
                            <Row gutter={[0, 6]}>
                                <Col span={24}>
                                    <Form.Item name="data_buffer_size">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                    </div>

                    <div className={styles.db__layout}>
                        <div className={"border__text"}>Sort Buffer (MB)</div>
                            <Row gutter={[0, 6]}>
                                <Col span={24}>
                                    <Form.Item name="sort_buffer_size">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                    </div>


                    <div className={styles.db__layout}>
                        <div className={"border__text"}>Log Buffer (MB)</div>
                            <Row gutter={[0, 6]}>
                                <Col span={24}>
                                    <Form.Item name="log_buffer_size">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                    </div>

                    <div className={styles.db__layout}>
                        <div className={"border__text"}>Other</div>
                        <Row>
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
                                      checked={checkbox.auto_restart_server === "yes"}
                                      onClick={handleCheckBox}>auto_restart_server</Checkbox>
                        </Col>
                        <Col span={24}>
                            <Checkbox name="java_stored_procedure"
                                      checked={checkbox.java_stored_procedure === "yes"}
                                      onClick={handleCheckBox}>java_stored_procedure</Checkbox>
                        </Col>

                    </div>
                </div>
            </Form>
            <Divider style={{margin: "6px 0"}}/>
            <div style={{display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 12}}>
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
        </div>
    )
}