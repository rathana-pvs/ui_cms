import {Table} from "antd";
import {use, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import PieChart from "@/components/common/chart/PieChart";



const VolumeSpace = (props)=>{
    const {contents} = useSelector(state=>state.general)
    const [data, setData] = useState([]);
    const [dataChart, setDataChart] = useState([]);
    const columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Value", dataIndex: "value" },
    ];



    useEffect(() => {
        const keys = ["location", "type", "purpose", "freepage", "usedpage", "totalpage"]
        const content = contents.find(res=>res.key === props.uniqueKey)
        const newData = []
        keys.forEach(key => {
            if(content[key])
                newData.push({
                    name: key,
                    value: content[key],
                })
        })
        setData(newData);

        const freePage = Number((content["freepage"] || "").trim() || 0);
        const usedPage = Number((content["usedpage"] || "").trim() || 0);
        setDataChart([freePage, usedPage]);

    }, []);



    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                showHeader={false}   // 🔥 hides the table header
                pagination={false}
                bordered
            />
            <div style={{ width: 300, height: 300 }}>
                <PieChart data={
                    {
                        labels: ["Used Page", "Free Page"],
                        datasets: [
                            {
                                data: dataChart,
                                backgroundColor: ["#4e79a7", "#f28e2b"],
                            },
                        ],
                    }
                }/>
            </div>
        </div>
    )
}

export default VolumeSpace;