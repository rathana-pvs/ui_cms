import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme } from 'antd';
import DatabaseVolumes from "@/components/contents/dashboard/DatabaseVolumes";
import Brokers from "@/components/contents/dashboard/Brokers";
import Databases from "@/components/contents/dashboard/Databases";
import SystemInfo from "@/components/contents/dashboard/SystemInfo";
import {useSelector} from "react-redux";
// import SystemStatus from "@/components/contents/dashboard/SystemStatus";



const getItems = (panelStyle) => [
    {
        key: '1',
        label: <b>Database Volumes</b>,
        children: <DatabaseVolumes />,
        style: panelStyle,
    },
    {
        key: '2',
        label: <b>Brokers</b>,
        children: <Brokers />,
        style: panelStyle,
    },
    // {
    //     key: '3',
    //     label: <b>System Status</b>,
    //     // children: <SystemStatus />,
    //     style: panelStyle,
    // },
    {
        key: '4',
        label: <b>Databases</b>,
        children: <Databases />,
        style: panelStyle,
    },
    {
        key: '5',
        label: <b>System Info</b>,
        children: <SystemInfo/>,
        style: panelStyle,
    },
];
const Dashboard = () => {
    const { token } = theme.useToken();
    const {selectedObject} = useSelector((state) => state.general);
    const panelStyle = {
        marginBottom: 8,
    };
    console.log(selectedObject);
    if(!selectedObject.serverId) {
        return null;
    }

    return (
        <Collapse
            bordered={false}
            defaultActiveKey={['1', '3', '4', '5']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            items={getItems(panelStyle)}
        />
    );
};
export default Dashboard;