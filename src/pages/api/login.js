import axiosInstance from "@/lib/agent";
import {generateToken, verifyToken} from "@/utils/remember-me";

export default async function handler(req, res) {

    try {
        const { method } = req;

        if (method === "POST"){

            let { host, port, id, remember } = req.body;
            let password = verifyToken(req.body.password);

            const response = await axiosInstance.post(`https://${host}:${port}/cm_api`, {
                id, password,
                task:"login",
                clientver: "8.4"
            })
            let data = response.data;
            if(remember){
                data.rememberPassword = generateToken(password);
            }
            res.status(200).json(data);

        }else{
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (error) {
        res.status(200).json({ success: false, note: error.toString() });
    }
}
