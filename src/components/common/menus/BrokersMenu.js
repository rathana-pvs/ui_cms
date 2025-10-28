import {Dropdown} from "antd";
import {
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {useDispatch, useSelector} from "react-redux";

import {setLoading} from "@/store/dialogReducer";
import {startAllBroker, stopAllBrokers} from "@/utils/action";


export default function({node, event, open, onClose}) {
    const {servers, brokers} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const started = node.status === "ON";
    const menuItems = [
        {
            label: started ? "Stop Broker": "Start Broker",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: async () => {


                if (!started) {
                    await startAllBroker(node, dispatch);
                } else {
                    await stopAllBrokers(node, dispatch);
                }
            }
        },
        {
            label: "Show Status",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        },
        {
            label: "Edit Broker",
            key: nanoid(4),
            icon: <ReloadOutlined />,
            onClick: ()=>{
                // dispatch(addContents({ ...node, ...CONFIG_PARAM_CONTENT[1], children: CONFIG_PARAM_CONTENT[1].screen}))
            }

        },
        {
            label: "Properties",
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
