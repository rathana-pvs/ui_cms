import React from 'react';
import {Modal, Tabs} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteContents,
    setActivePanel,
    setClosePanelKey,
    setContents,
    setSignalSavePanel
} from "@/store/generalReducer";
// import {deleteContents, setActivePanel, setSelectedObject, setSignalSavePanel} from "@/state/generalSlice";


const Content = () => {
    const {activePanel, contents, unsavedPanels} = useSelector(state => state.general);
    const dispatch = useDispatch();
    const onChange = (key) => {
        dispatch(setActivePanel(key));
    };

    const remove = (targetKey) => {

        if(contents.length > 1) {
            const activeKey = contents.at(-2).key;
            dispatch(setActivePanel(activeKey));

        }
        dispatch(deleteContents(targetKey));

    };
    const onEdit = (targetKey, action) => {
        if (action === "remove") {
            if(unsavedPanels.includes(targetKey)) {
                dispatch(setClosePanelKey(targetKey));
            }else{
                remove(targetKey);
            }

        }
    };

    return (
        <div style={{height:'100%'}}>
            <Tabs
                className={"create__table"}
                style={{height:'100%'}}
                hideAdd
                onChange={onChange}
                activeKey={activePanel}
                type="editable-card"
                onEdit={onEdit}
                items={contents.map(({key,children: Comp, label, icon})=>{
                    return{
                        key,
                        label,
                        icon,
                    closeIcon: <i className="fa-solid fa-xmark" style={{fontSize: 13}}></i>,
                    children: <Comp uniqueKey={key}/>}
                })}
                size={"large"}
                tabBarStyle={{
                    borderRadius: 12,
                }}
            >

            </Tabs>

        </div>

    );
};
export default Content;