import {Provider, useSelector} from 'react-redux';
import {store} from '@/store/store';
import {ConfigProvider, theme} from "antd";
import '../styles/globals.css';
import {IntlProvider} from "next-intl";
import {useEffect, useState} from "react";
import LoadingScreen from "@/components/common/modal/LoadingScreen";
import { StyleProvider } from '@ant-design/cssinjs';
import {useAuth} from "@/hook/useAuth";
import { useRouter } from "next/router";

// import LoadingScreen from "@/components/ui/dialogs/LoadingScreen";

// function LocaleWrapper({children}) {
//     const locale = useSelector((state) => state.general.locale);
//     const [messages, setMessages] = useState(null);
//
//     useEffect(() => {
//         setMessages(null);
//         import(`@/locales/${locale}.json`).then(res => setMessages(res.default))
//     }, [locale])
//
//     if (!messages) return null;
//
//     return (
//         <IntlProvider key={locale} locale={locale} messages={messages}>
//             {children}
//         </IntlProvider>
//     );
// }



const lightTheme = {
    primary: "#2563EB",
    primaryAccent: "#1D4ED8",
    background: "#fff",
    card: "#FFFFFF",
    border: "#BDC3C7",
    text: "#4B5563",
    success: "#2ECC71",
    error: "#E74C3C",
    warning: "#F39C12",
    info: "#3498DB",
};

const darkTheme = {
    primary: "#1ABC9C",
    primaryAccent: "#3498DB",
    background: "#1E1E2E",
    card: "#2C3E50",
    border: "#34495E",
    text: "#ECF0F1",
    success: "#27AE60",
    error: "#E74C3C",
    warning: "#F39C12",
    info: "#3498DB",
};




function AppWrapper({ Component, pageProps }) {
    const router = useRouter();
    const {loading} = useAuth();

    const themeMode = useSelector((state) => state.pref.themeMode);
    const palette = themeMode === "dark" ? darkTheme : lightTheme;

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    const customTheme = {
        token: {
            colorPrimary: palette.primary,
            colorBgContainer: palette.background,
            colorText: palette.text,
        },
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };

    return (
        <ConfigProvider theme={customTheme}>
            {loading? <h1>Loading...</h1> : <Component {...pageProps} />}
            <LoadingScreen />
        </ConfigProvider>
    );
}


export default function (props) {

    return (
        <Provider store={store}>
            <AppWrapper {...props}/>
        </Provider>
    )
}


