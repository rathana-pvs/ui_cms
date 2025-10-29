import React, {useEffect, useState} from 'react';
import styles from '@/components/contents/dashboard/dashboard.module.css'
import {Checkbox, Table, } from 'antd';
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {deletePrefAutoStartupDatabase, getPrefAutoStartupDatabase, setPrefAutoStartupDatabase} from "@/preference/pref";
import {getDatabasesAPI} from "@/api/cmApi";



export default function (){
    const {activeServer} = useSelector(state=>state.treeReducer);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (activeServer.uid) {
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
    },[])


    return(
        <div className={styles.database}>
            <Table  pagination={false} loading={loading} columns={columns} dataSource={data} />
        </div>

    )
}
