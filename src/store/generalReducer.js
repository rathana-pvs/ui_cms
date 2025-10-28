import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    selectedObject: {},
    activePanel: "",
    unsavedPanels: [],
    signalSavePanel: [],
    contents: [],
    locale: "en",
    treeKey: [],
    closePanelKey: "",

};

const generalReducer = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setSelectedObject: (state, action) => {
            state.selectedObject = action.payload;
        },
        setContents: (state, action) => {
            state.contents = action.payload;
        },
        addContents: (state, action) => {
            state.contents.push(action.payload);
        },
        deleteContents: (state, action) => {
            state.contents = state.contents.filter(item => item.key !== action.payload);
        },
        setActivePanel: (state, action) => {
            state.activePanel = action.payload;
        },
        setUnsavedPanels: (state, action) => {
            state.unsavedPanels = action.payload;
        },
        deleteUnsavedPanels: (state, action) => {
            state.unsavedPanels = state.unsavedPanels.filter(item => item !== action.payload);
        },
        setSignalSavePanel: (state, action) => {
            state.signalSavePanel.push(action.payload);
        },
        deleteSignalSavePanel: (state, action) => {
            state.signalSavePanel = state.signalSavePanel.filter(item => item !== action.payload);
        },
        setLocale(state, action) {
            state.locale = action.payload;
        },
        setTreeKey(state, action) {
            state.treeKey = action.payload;
        },
        setClosePanelKey(state, action) {
            state.closePanelKey = action.payload;
        }
    },
});

export const { setSelectedObject, setContents,
    setSignalSavePanel, deleteSignalSavePanel,
    setUnsavedPanels, deleteUnsavedPanels,  addContents,
    deleteContents, setActivePanel,
    setTreeKey,
    setLocale, setClosePanelKey } = generalReducer.actions;
export default generalReducer.reducer;