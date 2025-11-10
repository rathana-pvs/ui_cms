import React, { useEffect, useRef, useState } from 'react';
import styles from '@/components/composite/contents/dashboard/dashboard.module.css';
import { Checkbox, Table } from 'antd';
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";
import {
    deletePrefAutoStartupDatabase,
    getIntervalDashboard,
    getPrefAutoStartupDatabase,
    setPrefAutoStartupDatabase
} from "@/preference/pref";
import { getDatabasesAPI } from "@/lib/api/cmApi";

export default function DatabaseDashboard(props) {
    const { activePanel } = useSelector(state => state.general);
    const { activeServer } = useSelector(state => state.treeReducer);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ useRef to store the interval ID safely
    const intervalRef = useRef(null);

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
            render: (value, record) => (
                <Checkbox
                    defaultChecked={value}
                    onClick={({ target }) => {
                        if (target.checked) {
                            setPrefAutoStartupDatabase(record);
                        } else {
                            deletePrefAutoStartupDatabase(record);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    const getRefreshData = async () => {
        if (!activeServer?.uid) return;

        const response = await getDatabasesAPI(activeServer);
        if (response.success) {
            const prefAuto = getPrefAutoStartupDatabase();
            const newData = response.result?.map(res => {
                const prefKey = `${activeServer.uid}.${res.dbname}`;
                return {
                    serverId: activeServer.uid,
                    key: nanoid(4),
                    database: res.dbname,
                    auto: prefAuto?.includes(prefKey),
                    status: res.status === "active" ? "running" : "stopped",
                };
            });
            setData(newData);
        }
        setLoading(false);
    };

    // Run once initially
    useEffect(() => {
        if (activeServer.uid) {
            getRefreshData();
        }
    }, []);

    // Handle interval updates when panel changes
    useEffect(() => {
        // ✅ clear old interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // ✅ start a new one if this panel is active
        if (props.uniqueKey === activePanel) {
            const interval = getIntervalDashboard();
            if (interval) {
                const value = parseInt(interval, 10);
                intervalRef.current = setInterval(getRefreshData, value * 1000);
            }
        }

        // ✅ cleanup when component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activePanel]);

    return (
        <div className={styles.database}>
            <Table
                pagination={false}
                loading={loading}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
}
