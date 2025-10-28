import {Dropdown} from "antd";
import {
    EditOutlined,
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {useDispatch, useSelector} from "react-redux";
// import {onStartBroker, onStopBroker} from "@/utils/utils";

export default function({node, event, open, onClose}) {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const started = node.status === "ON";
    const menuItems = [
        {
            label: started ? "Stop Broker": "Start Broker",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: async () => {
                if (started) {
                    // await onStopBroker(node, state, dispatch)
                } else {
                    // await onStartBroker(node, state, dispatch)
                }
            },
        },
        {
            label: "status",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        },
        {
            label: "properties",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        }
    ]
    return (
        <Dropdown overlayStyle={{minWidth: 200}}  menu={{items: menuItems}}
                  trigger={["contextMenu"]}
                  onOpenChange={onClose}
                  open={open} placement="bottomLeft">
            <div style={{ position: "absolute", left: clientX, top: clientY, width: 0, height: 0 }} />
        </Dropdown>
    )
}
