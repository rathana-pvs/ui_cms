import { createSlice } from '@reduxjs/toolkit';
import {getLocalConnections} from "@/utils/storage";


const initialState = {
    servers: [],
    activeServer: {},
    subServers: [],
    databases: [],
    brokers: [],
    subDatabase: [],
    tables: [],
    views: [],
    users: [],
    triggers: [],
    adminLogs: [],
    errorLogs: [],
};

const dialogReducer = createSlice({
    name: 'treeReducer',
    initialState,
    reducers: {
        setServers: (state, action) => {
            state.servers = action.payload;
        },
        setActiveServer: (state, action) => {
            state.activeServer = action.payload;
        },
        setSubServers: (state, action) => {
            state.subServers = action.payload;
        },
        setDatabases: (state, action) => {
            state.databases = action.payload;
        },
        setBrokers: (state, action) => {
            state.brokers = action.payload;
        },
        setSubDatabase: (state, action) => {
            state.subDatabase = action.payload;
        },
        setTables: (state, action) => {
            state.tables = action.payload;
        },
        setViews: (state, action) => {
            state.views = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setTriggers: (state, action) => {
            state.triggers = action.payload;
        },
        setAdminLogs: (state, action) => {
            state.adminLogs = action.payload;
        },
        setErrorLogs: (state, action) => {
            state.errorLogs = action.payload;
        }
    },
});

export const {setServers, setActiveServer,  setSubServers, setDatabases,
    setBrokers, setSubDatabase,
    setTables, setViews, setUsers,
    setTriggers, setAdminLogs, setErrorLogs} = dialogReducer.actions;
export default dialogReducer.reducer;