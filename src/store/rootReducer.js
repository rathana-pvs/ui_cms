import {combineReducers} from "@reduxjs/toolkit";
import {serverDisconnect} from "@/store/sharedAction";
import {getLocalConnections} from "@/utils/storage";
import treeReducer from "@/store/treeReducer";
import dialogReducer from "@/store/dialogReducer";
import generalReducer from "@/store/generalReducer";
import prefReducer from "@/store/prefReducer";
import authReducer from "@/store/authReducer";


const appReducer = combineReducers({
    treeReducer: treeReducer,
    auth: authReducer,
    dialog: dialogReducer,
    general: generalReducer,
    pref: prefReducer,
});


const rootReducer = (state, action) => {
    switch (action.type) {
        case serverDisconnect.type:
            return {...state, servers: getLocalConnections()};
        default:
            return appReducer(state, action);
    }
};

export default rootReducer;