
import {generateToken, verifyToken} from "@/utils/remember-me";

export default async function handler(req, res) {

    try {
        const { method } = req;
        if (method === "POST"){
            const password = generateToken(req.body.password);
            res.status(200).json({password, success: true});
        }else{
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (error) {
        res.status(200).json({ success: false, note: error.errors.toString() });
    }
}
