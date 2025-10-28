import axios from "axios";

const request = axios.create({
    timeout: 0, // Optional timeout (10s)
});

request.interceptors.response.use(
    (response) => response, // If request is successful, just return response
    (error) => {
        if (error.response) {
            // Server responded with an error status
            switch (error.response.status) {
                case 400:
                    console.error("🚨 Bad Request:", error.response.data);
                    break;
                case 401:
                    console.error("🔒 Unauthorized: Please log in again.");
                    // Optional: Redirect to login page
                    break;
                case 403:
                    console.error("⛔ Forbidden: You don't have permission.");
                    break;
                case 404:
                    console.error("❌ Not Found: Resource does not exist.");
                    break;
                case 500:
                    console.error("💥 Server Error: Please try again later.");
                    break;
                default:
                    console.error(`⚠️ Error ${error.response.status}:`, error.response.data);
            }
        } else if (error.request) {
            // No response from server
            console.error("📡 No response from server. Check your connection.");
        } else {
            // Other errors
            console.error("❗ Request error:", error.message);
        }

        // Always reject the promise to allow further error handling in components
        return Promise.reject(error);
    }
);

const  CMRequest= axios.create({
    baseURL: "https://192.168.2.36:8080",
});

export  {request, CMRequest};