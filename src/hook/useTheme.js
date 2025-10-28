import { theme, ConfigProvider } from "antd";
import { useSelector } from "react-redux";

export function useTheme() {
    const { token } = theme.useToken();
    const { theme: configTheme } = ConfigProvider.useConfig();
    const themeMode = useSelector((state) => state.pref.themeMode);

    // 🎨 Custom design tokens
    const lightTheme = {
        // Brand
        primary: "#2C3E50",
        primaryAccent: "#2980B9",
        primaryText: "#FFFFFF",

        // Neutrals
        background: "#F8F9FA",
        card: "#FFFFFF",
        border: "#BDC3C7",
        text: "#2C3E50",

        // Status
        success: "#2ECC71",
        error: "#E74C3C",
        warning: "#F39C12",
        info: "#3498DB",
    };

    const darkTheme = {
        // Brand
        primary: "#1ABC9C",
        primaryAccent: "#3498DB",

        // Neutrals
        background: "#1E1E2E",
        card: "#2C3E50",
        border: "#34495E",
        text: "#ECF0F1",

        // Status
        success: "#27AE60",
        error: "#E74C3C",
        warning: "#F39C12",
        info: "#3498DB",
    };

    return {
        // AntD tokens (spacing, fontSize, colorPrimary, etc.)
        token,

        // Component-level config overrides from <ConfigProvider theme={{}}>
        components: configTheme?.components || {},

        // Custom design palette (light / dark)
        theme: themeMode === "dark" ? darkTheme : lightTheme,
    };
}
