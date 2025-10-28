import axiosInstance from "@/lib/agent";



export default async function handler(req, res) {

    try {
        const { method } = req;

        if (method === "POST"){
            const { host, port, ...payload} = req.body;
            const response = await axiosInstance.post(`https://${host}:${port}/cm_api`, payload)
                .then(res=> res.data)
            res.status(200).json(response);

        }else{
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (error) {
        res.status(500).json({note: error.message });
    }
}
