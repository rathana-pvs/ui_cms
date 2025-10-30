import styles from "@/layout/action/ActionHeader.module.css"
import {setLocale} from "yup";
import ActionButton from "@/layout/action/ActionButton";
import {setConnection} from "@/store/dialogReducer";
import {useDispatch} from "react-redux";





const ActionHeader = ()=>{
    const dispatch = useDispatch();

    return (
        <div className={styles.layout}>
            <ActionButton icon={<i className="fa-solid fa-rectangle-history-circle-plus"/>}

                          onClick={ () => dispatch(setConnection({open: true, type: "add"}))}
                          title={"Add Host"} />
            <ActionButton icon={<i className="fa-regular fa-play"/>} title={"Start"}/>
            <ActionButton icon={<i className="fa-regular fa-table"/>} title={"Schema"}/>
            <ActionButton icon={<i className="fa-solid fa-arrow-right-arrow-left"></i>} title={"Data"}/>
        </div>
    )
}

export default ActionHeader;