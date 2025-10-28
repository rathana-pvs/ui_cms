import React from "react";
import styles from "./header.module.css";
import {Dropdown} from "antd";
import {LogoutOutlined, UserDeleteOutlined} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {useTranslations} from "next-intl";
import {useDispatch, useSelector} from "react-redux";
// import FileMenu from "@/components/common/header/FileMenu";
// import ToolMenu from "@/components/common/header/ToolMenu/ToolMenu";
import ActionMenu from "@/components/common/header/ActionMenu";
import HelpMenu from "@/components/common/header/HelpMenu";
import FileMenu from "@/components/common/header/FileMenu";
// import FileMenu from "@/components/common/header/FileMenu";
// import ToolMenu from "@/components/common/header/ToolMenu/ToolMenu";
// import ActionMenu from "@/components/common/header/ActionMenu";
// import HelpMenu from "@/components/common/header/HelpMenu";
// import {setLocale} from "@/state/generalSlice";
import { useRouter, usePathname } from "next/navigation";
export default function () {
    const router = useRouter();
    // const {locale} = useSelector(state => state.general);
    const {user} = useSelector((state) => state.auth)
    const menus = [] //[file, tools, action, help];
    const t = useTranslations()

    const dispatch = useDispatch();
    const language = [
        {
            label: <b>EN</b>,
            key: nanoid(4),
            // onClick: ()=>dispatch(setLocale("en")),
        },
        {
            label: <b>KR</b>,
            key: nanoid(4),
            // onClick: ()=>dispatch(setLocale("kr")),
        }
    ]
    // useEffect(() => {
    //     setLocale(lang)
    // },[lang])
    const menuItems = [
        {
            key: "profile",
            label: (<>
                <UserDeleteOutlined /> Logout
            </>),
        },
        {
            key: "logout",
            label: (
                <>
                    <LogoutOutlined style={{color: "var(--color-error)"}}/> Logout
                </>
            ),
            onClick: () => {
                localStorage.removeItem("token");
                router.replace("/login");
            }
        },
    ];
    return (
        <div className={styles.layout}>
            <div className={styles.layout__menu}>
                <FileMenu/>
                {/*<ToolMenu/>*/}
                <ActionMenu/>
                <HelpMenu/>
                {/*{[t("header.title.file"), t("header.title.tools"), t("header.title.action"), t("header.title.help")].map((item, index) => (*/}
                {/*    <Dropdown key={index} menu={{ items: menus[index] }} trigger={['click']}>*/}
                {/*        <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>*/}
                {/*            {item}*/}
                {/*        </div>*/}
                {/*    </Dropdown>*/}
                {/*))}*/}
            </div>

            <div className={styles.layout__action}>
                <div className={styles.action__language}>
                    <Dropdown menu={{ items: language }} trigger={['click']}>
                        <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                            {/*{locale.toUpperCase()}*/}
                        </div>
                    </Dropdown>
                </div>
                <div className={styles.user__nav__layout}>
                    <div className={styles.user__nav__title}>{user.id}</div>
                    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                        <div className={styles.dropdown__menu} onClick={(e) => e.preventDefault()}>
                            <UserDeleteOutlined />
                        </div>
                    </Dropdown>
                    {/*<UserDeleteOutlined />*/}
                </div>

            </div>
        </div>
    )

}