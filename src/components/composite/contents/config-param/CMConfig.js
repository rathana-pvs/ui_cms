import React, {useEffect, useState} from 'react';
import Editor from '@monaco-editor/react';

import {useDispatch, useSelector} from "react-redux";

import ConfirmAction from "@/components/common/modal/ConfirmAction";
import {setLoading} from "@/store/dialogReducer";
import {
    deleteContents,
    deleteSignalSavePanel,
    deleteUnsavedPanels,
    setActivePanel,
    setUnsavedPanels
} from "@/store/generalReducer";
import {getAllSystemParamAPI, getResponse} from "@/lib/api/cmApi";

const CodeEditorPage = () => {
    const {contents, activePanel, closePanelKey, unsavedPanels, signalSavePanel} = useSelector(state => state.general);
    const {activeServer} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch()
    const [server, setServer] = useState({})
    const {servers} = useSelector(state => state);
    const [isChange, setIsChange] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {

        dispatch(setLoading(true))
        getAllSystemParamAPI(activeServer, {confname: "cm.conf"}).then(res => {
            dispatch(setLoading(false))
            console.log(res)
            if(res.success) {
                setCode(res.result.join("\r\n"));
            }
        })
    },[])

    const handleChange = (value)=>{
        setCode(value)
        setIsChange(true)

    }
    useEffect(()=>{
        if(isChange){
            dispatch(setUnsavedPanels([...new Set([...unsavedPanels, activePanel])]))
        }
    },[isChange])

    useEffect(()=>{

        if(unsavedPanels.includes(closePanelKey)){
            ConfirmAction({
                content: "Do you want to save changes?",
                onOk: () => {
                    dispatch(setLoading(true))
                    getResponse(activeServer, {
                        task: "setsysparam",
                        confname: "cm.conf",
                        confdata: code.split("\r\n")})
                        .then(res =>{
                            dispatch(setLoading(false))
                            if(res.status === "success") {
                                removePanel()
                            }
                        })
                },
                onCancel: () => {
                    removePanel()
                }
            })
        }


    },[closePanelKey])

    const removePanel = ()=>{
        if(contents.length > 1) {
            const activeKey = contents.at(-2).key;
            dispatch(setActivePanel(activeKey));
        }
        dispatch(deleteContents(activePanel));
        dispatch(deleteSignalSavePanel(activePanel));
        dispatch(deleteUnsavedPanels(activePanel));
        setIsChange(false)
    }
    console.log(closePanelKey, unsavedPanels)

    return (
        <Editor
            height="100%"
            defaultLanguage="ini"
            value={code}
            theme="vs-white"
            onChange={handleChange}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
            }}
        />
    );
};

export default CodeEditorPage;
