import {useToken} from "antd/es/theme/internal";
import {useTheme} from "@/hook/useTheme";
import {Button} from "antd";


const CButton = ()=>{
    const {theme} = useTheme();
    const token = useToken();
    return (
        <Button style={{backgroundColor: theme.primary, color: theme.primaryText}}>
            Button
        </Button>
    )
}

export default CButton