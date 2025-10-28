import nextI18NextConfig from './next-i18next.config.js'
/** @type {import('next').NextConfig} */
const nextConfig = {
    ...nextI18NextConfig, // includes i18n block
    reactStrictMode: false,
    experimental: { appDir: false },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;
