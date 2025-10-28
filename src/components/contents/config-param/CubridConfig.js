import React, {useEffect, useState} from 'react';
import Editor from '@monaco-editor/react';
// import {getAPIParam} from "@/utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {setLoading} from "@/store/dialogReducer";
import {
    deleteContents,
    deleteSignalSavePanel,
    setActivePanel,
    setClosePanelKey,
    setUnsavedPanels
} from "@/store/generalReducer";
import ConfirmAction from "@/components/common/modal/ConfirmAction";
import {getAllSystemParamAPI, getResponse} from "@/api";

const CodeEditorPage = () => {
    const {contents, activePanel, closePanelKey, unsavedPanels} = useSelector(state => state.general);
    const {servers} = useSelector(state => state.treeReducer);
    const dispatch = useDispatch()
    const [server, setServer] = useState({})
    const [isChange, setIsChange] = useState(false);
    const [code, setCode] = useState('');

    useEffect(() => {
        const content = contents.find(res => res.key === activePanel)

        dispatch(setLoading(true))

        getAllSystemParamAPI(content, {confname: "cubrid.conf"}).then(({result}) => {
            dispatch(setLoading(false))
            setCode(result.join("\r\n"));

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
                        const content = contents.find(res => res.key === activePanel)
                        dispatch(setLoading(true))
                        getResponse(content, {
                            task: "setsysparam",
                            confname: "cubrid.conf",
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
        dispatch(setClosePanelKey(""));
    }


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
