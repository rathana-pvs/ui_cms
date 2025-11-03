import fetch from "node-fetch";
import https from "https";

export default async function handler(req, res) {
    const { method, headers, body } = req;
    const path = req.query.path.join("/");
    const backendUrl = `https://192.168.2.36:8080/${path}`;
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        const response = await fetch(backendUrl, {
            method,
            headers: {
                ...headers,
                Authorization: headers.authorization,
                "Content-Type": "application/json",
            },
            body: method !== "GET" && method !== "HEAD" && method !== "DELETE"
                ? JSON.stringify(body)
                : undefined,
            agent: httpsAgent, // works with node-fetch
        });

        const contentType = response.headers.get("content-type") || "";

        let data = null;
        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // fallback if not JSON
            data = await response.text();
        }
        res.status(response.status).json(data);
    } catch (err) {
        console.error("Proxy Error:", err);
        res.status(500).json({ error: "Proxy request failed", details: err.message });
    }
}
