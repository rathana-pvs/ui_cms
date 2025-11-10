import {Dropdown} from "antd";
import {
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {setCreateDB} from "@/store/dialogReducer";
import {useDispatch} from "react-redux";

export default function({node, event, open, onClose}) {
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const menuItems = [
        {
            label: "Create Database",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: ()=>{
                dispatch(setCreateDB({open: true, node}));
            },
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
