import styles from './button.module.css'
import {Button} from "antd";

export default function (props) {
    return (
        <button {...props} onClick={()=>{}} className={styles.icon_button}>
            {props.children}
        </button>
    )
}


