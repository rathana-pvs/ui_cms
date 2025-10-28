import React, { useState } from "react";
import {Modal, Tabs, Form, Input, Table, Button, Menu, Divider, Row, Col} from "antd";
import styles from "@/components/common/modal/dialog.module.css";
import {useSelector} from "react-redux";
import Broker from "@/components/common/modal/property/Broker";
// import Common from "@/components/common/modal/property/Common/Common";

const { TabPane } = Tabs;

const screenData = {
    broker: {screen: <Broker />},
    // common: {screen: <Common/>}

}

export default function (){
    const {property} = useSelector((state) => state.dialog);
    const [screen, setScreen] = useState("");


    const menuItem = [
        {
            label: "Configuration Parameters",
            key: "config",
            children: [
                {label: "Server Common Parameters", key: "common", onClick: () => setScreen("common"),},
                {label: "Broker", key: "broker", onClick: () => setScreen("broker")}
            ]
        }
    ]
    return (
        <Modal
            title="Brokers"
            open={property.open}
            // onOk={onOk}
            // onCancel={onCancel}
            footer={null}
            width={1080}
        >
            <div className={styles.property__layout}>
                <div className={styles.property__layout__menu}>
                    <Menu
                        // onClick={onClick}
                        mode="inline"
                        inlineC
                        items={menuItem}
                    />
                </div>
                {screenData[screen]?.screen}
            </div>
        </Modal>
    );
};

