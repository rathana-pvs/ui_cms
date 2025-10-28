// lib/axios-instance.js
import axios from 'axios';
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false,

});
// Create Axios instance with the custom HTTPS agent
const axiosInstance = axios.create({
    timeout: 0,
    httpsAgent: agent, // Attach the agent here
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
