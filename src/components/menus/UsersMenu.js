import {Dropdown} from "antd";
import {
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {useDispatch, useSelector} from "react-redux";
import {setUserDB} from "@/store/dialogReducer";

export default function({node, event, open, onClose}) {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const menuItems = [
        {
            label: "Create DB User",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: () => {dispatch(setUserDB({open: true, type: "add", node}))}
        },
        {
            label: "Refresh",
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
