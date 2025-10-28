import {Dropdown, Modal} from "antd";
import {
    PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {setUserDB} from "@/store/dialogReducer";
import {useDispatch, useSelector} from "react-redux";
// import {deleteUser} from "@/state/userSlice";
// import {deleteUserDB} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";

export default function({node, event, open, onClose}) {
    const {servers, databases} = useSelector(state => state);
    const loginDB = useSelector(state => state.dialog.loginDB)
    const dispatch = useDispatch();
    const {clientX, clientY} = event;
    const menuItems = [
        {
            label: "Edit User",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: () => {dispatch(setUserDB({open: true, type: "edit", node}))}
        },
        {
            label: "Delete User",
            key: nanoid(4),
            icon: <PlusOutlined />,
            onClick: () => onDelete()
        },
        {
            label: "Refresh",
            key: nanoid(4),
            icon: <ReloadOutlined />,

        }
    ]

    const onDelete = () => {
        Modal.confirm({
            title: 'Are you sure?',
            content: `Delete User ${node.title}?`,
            okText: 'Yes',
            cancelText: 'No',
            async onOk() {

                const server = servers.find(res => res.serverId === node.serverId)
                const database = databases.find(res => res.key === node.databaseId)
                const response = await deleteUserDB({
                    ...getAPIParam(server),
                    dbname: database.title,
                    username: node.title
                })
                if(response.status){
                    // dispatch(deleteUser(node.key));
                }
            },
            onCancel() {

            },
        });
    }
    return (
        <Dropdown overlayStyle={{minWidth: 200}}  menu={{items: menuItems}}
                  trigger={["contextMenu"]}
                  onOpenChange={onClose}
                  open={open} placement="bottomLeft">
            <div style={{ position: "absolute", left: clientX, top: clientY, width: 0, height: 0 }} />
        </Dropdown>
    )
}