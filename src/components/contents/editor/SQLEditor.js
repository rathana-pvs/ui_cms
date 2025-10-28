import React, {useEffect, useState} from 'react';
import { Card } from 'antd';
import Editor from '@monaco-editor/react';
import {getCMConfig, getCubridConfig, setCMConfig, setCubridConfig} from "@/utils/api";
import {getAPIParam} from "@/utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteContents,
    deleteSignalSavePanel,
    deleteUnsavedPanels,
    setActivePanel,
    setUnsavedPanels
} from "@/state/generalSlice";
import {setLoading} from "@/state/dialogSlice";
import ConfirmAction from "@/components/ui/dialogs/ConfirmAction";

const CodeEditorPage = () => {
    const {contents, activePanel, unsavedPanels, signalSavePanel} = useSelector(state => state.general);
    const dispatch = useDispatch()
    const [server, setServer] = useState({})
    const {servers} = useSelector(state => state);
    const [isChange, setIsChange] = useState(false);
    const [sql, setSql] = useState("");

    useEffect(() => {
        const content = contents.find(res => res.key === activePanel)
        const server = servers.find(res => res.serverId === content.serverId)
        setServer(server);
        if(content.sql){
            setSql(content.sql.join("\n"));
        }

    },[])

    const handleChange = (value)=>{
        setIsChange(true)

    }

    return (
        <Editor
            height="100%"
            defaultLanguage="sql"
            value={sql}
            theme="vs-white"
            onChange={handleChange}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: "on",         // ✅ useful for long SQL
                scrollBeyondLastLine: false,
                renderLineHighlight: "all",
            }}
        />
    );
};

export default CodeEditorPage;
