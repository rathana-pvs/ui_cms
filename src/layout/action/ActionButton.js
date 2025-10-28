import styles from '@/layout/action/ActionHeader.module.css'


const ActionButtons = ({title, icon, ...res}) => {

    return (
        <div className={styles.button__layout} {...res}>
            {icon}
            <div>{title}</div>
        </div>
    )
}


export default ActionButtons;