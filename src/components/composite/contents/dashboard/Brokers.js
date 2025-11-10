import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";
import styles from '@/components/composite/contents/dashboard/dashboard.module.css';
import { getBrokersAPI, getBrokerStatusAPI } from "@/lib/api/cmApi";
import { getBrokerFormat } from "@/utils/navigation";
import { getIntervalDashboard } from "@/preference/pref";

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'state', key: 'status' },
    // ...other columns
];

export default function BrokerDashboard(props) {
    const { activePanel } = useSelector(state => state.general);
    const { activeServer } = useSelector(state => state.treeReducer);
    const [brokerData, setBrokerData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ store interval per component
    const intervalRef = useRef(null);

    const getRefreshData = async () => {
        console.log("Refreshing...");
        try {
            const res = await getBrokersAPI(activeServer);
            const newBrokers = res.result?.map(item => getBrokerFormat(item)) || [];

            const responses = await Promise.all(
                newBrokers.map(b => getBrokerStatusAPI(activeServer, { bname: b.name }))
            );

            const dataSource = responses
                .map((r, i) => {
                    if (!r.success) return null;
                    const result = r.result[0];
                    return {
                        ...newBrokers[i],
                        key: nanoid(4),
                        qps: result.as_num_query,
                        tps: result.as_num_tran,
                    };
                })
                .filter(Boolean);

            setBrokerData(dataSource);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getRefreshData(); // first load
    }, []);

    useEffect(() => {
        // clear previous interval if any
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // start new interval only if this panel is active
        if (props.uniqueKey === activePanel) {
            const interval = getIntervalDashboard();
            if (interval) {
                const value = parseInt(interval, 10);
                intervalRef.current = setInterval(getRefreshData, value * 1000);
            }
        }

        // ✅ cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activePanel]);

    return (
        <div className={styles.broker}>
            <Table
                pagination={false}
                bordered
                loading={loading}
                columns={columns}
                dataSource={brokerData}
            />
        </div>
    );
}
