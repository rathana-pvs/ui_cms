import React, {useEffect, useState} from 'react';
import styles from '@/components/contents/dashboard/dashboard.module.css'
import {Checkbox, Table, } from 'antd';
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {
    deletePrefAutoStartupDatabase,
    getIntervalDashboard,
    getPrefAutoStartupDatabase,
    setPrefAutoStartupDatabase
} from "@/preference/pref";
import {getDatabasesAPI} from "@/api/cmApi";



export default function (props){
    const {activePanel} = useSelector(state => state.general);
    const {activeServer} = useSelector(state=>state.treeReducer);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    let intervalId = null;
    const columns = [
        {
            title: 'Database',
            dataIndex: 'database',
            key: 'database',
        },
        {
            title: 'Auto Startup',
            dataIndex: 'auto',
            key: 'auto',
            render: (value, record) => {

                return <Checkbox defaultChecked={value} onClick={({target}) => {
                    if (target.checked) {
                        setPrefAutoStartupDatabase(record);
                    }else {
                        deletePrefAutoStartupDatabase(record);
                    }

                }}/>
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    const getRefreshData = async () => {
        getDatabasesAPI(activeServer).then(response => {
            if(response.success){
                let prefAuto = getPrefAutoStartupDatabase();
                setData(response.result?.map(res=>{
                    let prefKey =`${activeServer.uid}.${res.dbname}`
                    return {
                        serverId: activeServer.uid,
                        key: nanoid(4),
                        database: res.dbname,
                        auto: prefAuto?.includes(prefKey),
                        status: res.status === "active" ? "running" : "stopped",
                    }
                }))
            }

            setLoading(false)
        })
    }

    useEffect(() => {
        if (activeServer.uid) {
            getRefreshData()
        }
    },[])


    useEffect(() => {
        if(intervalId){
            clearInterval(intervalId);
            intervalId = null;
        }
        if(props.uniqueKey === activePanel){
            const interval = getIntervalDashboard()
            if(interval){
                const value = parseInt(interval)
                intervalId = setInterval(getRefreshData, value * 1000)
            }
        }
    },[activePanel])

    return(
        <div className={styles.database}>
            <Table  pagination={false} loading={loading} columns={columns} dataSource={data} />
        </div>

    )
}
