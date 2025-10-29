import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
import {useSelector} from "react-redux";
import styles from '@/components/contents/dashboard/dashboard.module.css'
import {getDatabasesAPI, getResponse} from "@/api/cmApi";

const columns = [
    {
        title: 'Database',
        dataIndex: 'database',
        key: 'database',
    },
    {
        title: 'Temp U/T/F',
        dataIndex: 'temporary',
        key: 'temporary',
    },
    {
        title: 'Permanent U/T/F',
        dataIndex: 'permanent',
        key: 'permanent',
    },
    {
        title: 'Active log',
        key: 'activeLog',
        dataIndex: 'activeLog'
    },
    {
        title: 'Archive Log',
        key: 'archiveLog',
        dataIndex: 'archiveLog',
    }
];


const getSizeFormat = (size)=>{
    if(size >= 1024 ** 3){
        return `${(size/1024**3).toFixed(0)}GB`
    }else if(size>=1024**2){
        return `${(size/1024**2).toFixed(0)}MB`;
    }else if(size>=1024){
        return `${(size/1024**2).toFixed(0)}KB`;
    }else{
        return `${size}B`;
    }
}


export default function (){
    const {activeServer} = useSelector(state=>state.treeReducer);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);

    const getVolumeColumn = (dbSpace, type)=>{
        let totalPage = 0
        let freePage = 0
        let pageSize = parseInt(dbSpace.pagesize);
        for(const space of dbSpace.spaceinfo){
            if(space.type === type){
                totalPage = totalPage + parseInt(space.totalpage)
                freePage = freePage + parseInt(space.freepage)
            }
        }
        if(totalPage > 0){
            return `${getSizeFormat((totalPage - freePage) * pageSize)} / ${getSizeFormat(totalPage*pageSize)}
             / ${(freePage*100/totalPage).toFixed(0)}%`
        }
        return "-"
    }

    const getLogColumn = (dbSpace, type)=>{
        let totalPage = 0
        let pageSize = parseInt(dbSpace.pagesize);
        for(const space of dbSpace.spaceinfo){
            if(space.type === type){
                totalPage = totalPage + parseInt(space.totalpage)
            }
        }
        if(totalPage > 0){
            return getSizeFormat(totalPage * pageSize)
        }
        return "-"
    }


    const getSpaceInfo = async () => {
        const resDB = await getDatabasesAPI(activeServer);
        let permanent = "-"
        let temporary = "-"
        let activeLog = "-"
        let archiveLog = "-"
        let tempData = []
        if(resDB.success){
            const allRequest = resDB.result?.filter(res=>res.status === "active").map(res=>{
                return getResponse(activeServer, {
                    task: "dbspaceinfo",
                    dbname: res.dbname
                })
            })

            const responses = await Promise.all(allRequest)
            for(const result of responses){
                if(result.status === "success"){
                    for(const spaceInfo of result.spaceinfo){
                        if(spaceInfo.type === "PERMANENT"){
                            permanent = getVolumeColumn(result, spaceInfo.type)
                        }else if(spaceInfo.type === "TEMPORARY"){
                            temporary = getVolumeColumn(result, spaceInfo.type)
                        }else if(spaceInfo.type === "Active_log"){
                            activeLog = getLogColumn(result, spaceInfo.type)
                        }else if(spaceInfo.type === "Archive_log"){
                            archiveLog = getLogColumn(result, spaceInfo.type)
                        }
                    }
                }
                tempData.push({
                    database: result.dbname,
                    permanent,
                    temporary,
                    activeLog,
                    archiveLog
                })
            }

        }
        setLoading(false)
        setDataSource(tempData)



    }

    useEffect(()=>{
        if(activeServer.uid){
            getSpaceInfo()
        }

    },[])


    return(
    <div className={styles.volume}>
        <Table pagination={false} loading={loading} columns={columns} dataSource={dataSource} />
    </div>
    )

}
