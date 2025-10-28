import {nanoid} from "nanoid";
import {setLocalStorage} from "@/utils/storage";


export function isNotEmpty(value) {
    if(value){
        if (Array.isArray(value)) {
            return value.length > 0;  // Check for non-empty array
        } else if (typeof value === 'object') {
            return Object.keys(value).length > 0;  // Check for non-empty object
        }
    }
    return false; // Return false for non-array, non-object values
}

export const formatMenuData = (data) => {
    return data.map(item => {
        const newItem = { ...item, key: nanoid(4) };
        if (item.children) {
            newItem.children = formatMenuData(item.children);
        }
        return newItem;
    });

}
export function isEmptyString(str){
    return !str || str.trim() === ""
}
export const typeDisplay = (type) => {
    if(type.includes("character varying(")){
        return type.replace("character varying", "varchar");
    }else if(type.includes("character(")){
        return type.replace("character", "char");
    }
    return type
}

export const getAPIParam = (server) => {
    // if (!server.token) {
    //     const response = await setToken(server)
    //     return {host: server.host, port: server.port, token: response.token};
    // }
    return {host: server.host, port: server.port, token: server.token};
}




export const setRememberPassword = (remember, serverId, connections)=>{
    let newConnections = connections
    if(!remember){
        newConnections = connections.map(({password, ...rest}) => {
            if(rest.serverId === serverId) {
                return rest
            }
            return {...rest, password};
        })
    }
    setLocalStorage("connections", newConnections);
}


//
// export const onRestartBrokers = async (broker, state, dispatch) => {
//     await onStopBrokers(broker, state, dispatch);
//     await onStartBrokers(broker, state, dispatch);
// }
//
//
// export const onStartBroker = async (broker, state, dispatch) => {
//     dispatch(setLoading(true));
//     const server = state.servers.find(res => res.serverId === broker.serverId);
//     // const response = await axios.post("/api/stop-brokers", {
//     //     ...getAPIParam(server)
//     // }).then(res => res.data)
//     const response = await startBroker({...getAPIParam(server), broker: broker.name});
//     dispatch(setLoading(false));
//     if (response.status) {
//         const newBrokers = state.brokers.map(res=>{
//             if((res.key === broker.key)){
//                 const newBroker = {
//                     ...res,
//                     status: "ON",
//                     icon: <i className="fa-light fa-folder-gear success"></i>,
//                 }
//                 dispatch(setSelectedObject(newBroker))
//                 return newBroker
//             }else{
//                 return res
//             }
//         })
//         dispatch(setBroker(newBrokers));
//     }else{
//         Modal.error({
//             title: 'Broker',
//             content: response.note,
//             okText: 'Close',
//         });
//     }
// }
//
//
//
// export const onStopBroker = async (broker, state, dispatch) => {
//     dispatch(setLoading(true));
//     const server = state.servers.find(res => res.serverId === broker.serverId);
//     const response = await stopBroker({...getAPIParam(server), broker: broker.name});
//     dispatch(setLoading(false));
//     if (response.status) {
//         const newBrokers = state.brokers.map(res=>{
//             if((res.key === broker.key)){
//                 const newBroker = {
//                     ...res,
//                     status: "OFF",
//                     icon: <i className="fa-light fa-folder-gear warning"></i>,
//                 }
//                 dispatch(setSelectedObject(newBroker))
//                 return newBroker
//             }else{
//                 return res
//             }
//         })
//         dispatch(setBroker(newBrokers));
//     }else{
//         Modal.error({
//             title: 'Broker',
//             content: response.note,
//             okText: 'Close',
//         });
//     }
// }
//
// export const onStartDatabase = async (node, state, dispatch) => {
//     dispatch(setLoading(true));
//     const server = state.servers.find(res => res.serverId === node.serverId);
//     const response = await axios.post("/api/start-db", {
//         ...getAPIParam(server),
//         database: node.title,
//     }).then(res => res.data)
//     dispatch(setLoading(false));
//     if (response.status) {
//         const newDatabases = state.databases.map((item) => {
//             if (item.key === node.key) {
//                 const newObject = {...item,
//                     status: "active",
//                     icon: <i className={`fa-light fa-database success`}/>,
//                 };
//                 dispatch(setSelectedObject(newObject))
//                 return newObject
//             }
//             return item;
//         })
//
//         dispatch(setDatabase(newDatabases));
//
//     }else{
//         Modal.error({
//             title: 'Database',
//             content: response.note,
//             okText: 'Close',
//         });
//     }
// }
//
//
// export const onStopDatabase = async (node, state, dispatch) => {
//     dispatch(setLoading(true));
//     const server = state.servers.find(res => res.serverId === node.serverId);
//     const response = await axios.post("/api/stop-db", {
//         ...getAPIParam(server),
//         database: node.title,
//     }).then(res => res.data)
//     dispatch(setLoading(false));
//     if (response.status) {
//         const newDatabases = state.databases.map((item) => {
//             if (item.key === node.key) {
//                 const newObject = {...item,
//                     status: "inactive",
//                     icon: <i className={`fa-light fa-database warning`}/>,
//                 };
//                 dispatch(setSelectedObject(newObject))
//                 return newObject
//             }
//             return item;
//         })
//
//         dispatch(setDatabase(newDatabases));
//
//     }else{
//         Modal.error({
//             title: 'Database',
//             content: response.note,
//             okText: 'Close',
//         });
//     }
// }
//
//
// export const onStartService = async (node, dispatch) => {
//     dispatch(setLoading(true));
//     const response = await getDatabases(getAPIParam(node))
//     if(response.status) {
//         for(let database of response.result) {
//             if(database.status === "inactive") {
//                 const res = await startDatabase({...getAPIParam(node), database: database.dbname });
//                 if(!res.status) {
//                     break;
//                 }
//             }
//         }
//     }
//     // start brokers
//     await startBrokers(getAPIParam(node))
//     dispatch(setLoading(false));
//
// }
//
//
// export const onStopService = async (node, dispatch) => {
//     dispatch(setLoading(true));
//     // get all databases
//     console.log(node)
//     const response = await getDatabases(getAPIParam(node))
//     if(response.status) {
//         for(let database of response.result) {
//             if(database.status === "active") {
//                 // stop all active databases
//                 const res = await stopDatabase({...getAPIParam(node), database: database.dbname });
//                 if(!res.status) {
//                     break;
//                 }
//             }
//         }
//     }
//     // stop brokers
//     await stopBrokers(getAPIParam(node)).then(res => res.data);
//     dispatch(setLoading(false));
//
// }
//
// export const extractParam = (lines)=>{
//     const result = {};
//     const uniqueKeys = new Set();
//     let currentSection = null;
//
//     lines.forEach(line => {
//         const trimmed = line.trim();
//
//         // Detect section headers like [broker] or [%query_editor]
//         const sectionMatch = trimmed.match(/^\[(%?[\w_]+)]$/);
//         if (sectionMatch) {
//             currentSection = sectionMatch[1];
//             result[currentSection] = {};
//             return;
//         }
//
//         // Handle key=value lines
//         if (currentSection && trimmed.includes('=') && !trimmed.startsWith("#")) {
//             const [key, value] = trimmed.split('=');
//             const cleanKey = key.trim();
//             result[currentSection][cleanKey] = value.trim();
//             uniqueKeys.add(cleanKey);
//         }
//     });
//
//     return [result, uniqueKeys];
// }
//
// export const injectParam = (data) => {
//
//     // Extract dynamic section keys
//     const sectionKeys = new Set();
//
//     data.forEach(row => {
//         Object.keys(row).forEach(key => {
//             if (key !== "key" && key !== "propertyName") {
//                 sectionKeys.add(key);
//             }
//         });
//     });
//
//     const lines = [
//         "#",
//         "# Copyright (C) 2009 Search Solution Corporation. All rights reserved by Search Solution.",
//         "#",
//         "#   This program is free software; you can redistribute it and/or modify",
//         "#   it under the terms of the GNU General Public License as published by",
//         "#   the Free Software Foundation; version 2 of the License.",
//         "#",
//         "#  This program is distributed in the hope that it will be useful,",
//         "#  but WITHOUT ANY WARRANTY; without even the implied warranty of",
//         "#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the",
//         "#  GNU General Public License for more details.",
//         "#",
//         "#  You should have received a copy of the GNU General Public License",
//         "#  along with this program; if not, write to the Free Software",
//         "#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA",
//         "",
//         "#"
//     ];
//
// // Sort section keys so "broker" appears first if present
//     const sortedSections = Array.from(sectionKeys).sort((a, b) => {
//         if (a === "broker") return -1;
//         if (b === "broker") return 1;
//         return a.localeCompare(b);
//     });
//
// // Generate lines by section
//     sortedSections.forEach(section => {
//         lines.push(`[${section}]`);
//         data.forEach(row => {
//             const value = row[section];
//             if (value && value !== "") {
//                 lines.push(`${row.propertyName}=${value}`);
//             }
//         });
//         lines.push("");
//     });
//     return lines
// }
//
//
export const extractBroker = (lines)=>{
    const result = { comment: "" };
    let currentSection = null;

    lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed.startsWith("#")) {
            result.comment += trimmed + "\n";
        } else if (trimmed === "") {
            return;
        } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            currentSection = trimmed.slice(1, -1);
            result[currentSection] = {};
        } else if (trimmed.includes("=") && currentSection) {
            const [key, ...rest] = trimmed.split("=");
            result[currentSection][key.trim()] = rest.join("=").trim();
        }
    });

    return result

}
//
// export const getAssembleBroker = (data)=>{
//
//     let lines = [];
//     const reserved = ["comment"]
//     lines = [data["comment"]]
//     // lines.push(...data["broker"].map(res=>`${res[0]}=${res[1]}`));
//     Object.keys(data).filter(key => !reserved.includes(key)).forEach(key => {
//         lines.push(``);
//         lines.push(`[${key}]`)
//         for(const name in data[key]){
//             if(name !== "notPersisted")
//                 lines.push(`${name}=${data[key][name]}`);
//         }
//     })
//     lines.push(``);
//     return lines;
// }
//
// export const getExtractConfig = (lines)=>{
//     const result = {};
//
//     lines.forEach((line) => {
//         const trimmed = line.trim();
//
//         // Ignore empty lines and comments
//         if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith("[")) {
//             return;
//         }
//
//         // Match key=value
//         const match = trimmed.match(/^([^=]+)=(.*)$/);
//         if (match) {
//             const key = match[1].trim();
//             result[key] = match[2].trim();
//         }
//     });
//
//     return result;
//
//
// }
// export const replaceConfig = (lines, updates) =>{
//     const updatedKeys = new Set();
//
//     const newLines = lines.map((line) => {
//         const trimmed = line.trim();
//
//         // Skip comments and empty lines
//         if (trimmed.startsWith("#") || trimmed === "") return line;
//
//         const match = trimmed.match(/^([^#=]+)=(.*)$/);
//         if (match) {
//             const key = match[1].trim();
//
//             if (key in updates) {
//                 updatedKeys.add(key);
//                 return `${key}=${updates[key]}`;
//             }
//         }
//
//         return line;
//     });
//
//     // Append missing keys
//     Object.entries(updates).forEach(([key, value]) => {
//         if (!updatedKeys.has(key)) {
//             newLines.push(`${key}=${value}`);
//         }
//     });
//
//     return newLines;
// }
//
//
// export const replaceLines = (lines, updateKeys)=>{
//     return lines.map((line) => {
//         const trimmed = line.trim();
//
//         // Keep comments, sections, and blank lines as-is
//         if (
//             trimmed === "" ||
//             trimmed.startsWith("#") ||
//             trimmed.startsWith("[")
//         ) {
//             return line;
//         }
//
//         const match = trimmed.match(/^([^=]+)=(.*)$/);
//         if (match) {
//             const key = match[1].trim();
//             return updateKeys[key] || line; // Replace full line if key matches
//         }
//
//         return line;
//     })
// }
//
// export const parseBoolean = (status)=>{
//     return status ? "yes" : "no"
// }
//
//
// export const extractConfig = (lines)=>{
//     const result = { comment: "" };
//     let currentSection = null;
//
//     lines.forEach(line => {
//         const trimmed = line.trim();
//
//         if (trimmed.startsWith("@")) {
//             result.comment += trimmed + "\n";
//         } else if (trimmed === "") {
//             return;
//         } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
//             currentSection = trimmed.slice(1, -1);
//             result[currentSection] = {};
//         } else if (trimmed.includes("=") && currentSection) {
//             const [key, ...rest] = trimmed.split("=");
//             result[currentSection][key.trim()] = rest.join("=").trim();
//         }
//     });
//
//     return result
//
// }
//
// export const parseSize = (str) => {
//     // Return null or unchanged input for invalid cases
//     if (!str || typeof str !== 'string') {
//         return str;
//     }
//
//     // Define units with their conversion factors to MB
//     const units = {
//         B: 1 / (1024 * 1024),   // Bytes
//         K: 1 / 1024,           // Kilobytes
//         M: 1,                  // Megabytes
//         G: 1024,               // Gigabytes
//         T: 1024 * 1024,
//         KB: 1 / 1024,           // Kilobytes
//         MB: 1,                  // Megabytes
//         GB: 1024,               // Gigabytes
//         TB: 1024 * 1024// Terabytes
//     };
//
//     // Match number (integer or decimal) followed by optional space and unit
//     const match = str.match(/^(\d*\.?\d+)\s*(B|K|M|G|T|KB|MB|GB|TB)$/i);
//
//     // Return original string if no valid match
//     if (!match) {
//         return Number(str.replace(/,/g, ''));
//     }
//
//     const [, value, unit] = match;
//     const numericValue = parseFloat(value);
//
//     // Validate numeric value
//     if (isNaN(numericValue) || numericValue < 0) {
//         return str;
//     }
//
//     // Convert to MB and return
//     return numericValue * units[unit.toUpperCase()];
// };
//
//
// export const createConfigFile = (data)=>{
//     const header = `
//
// #
// # Copyright (C) 2009 Search Solution Corporation. All rights reserved by Search Solution.
// #
// #   This program is free software; you can redistribute it and/or modify
// #   it under the terms of the GNU General Public License as published by
// #   the Free Software Foundation; version 2 of the License.
// #
// #  This program is distributed in the hope that it will be useful,
// #  but WITHOUT ANY WARRANTY; without even the implied warranty of
// #  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// #  GNU General Public License for more details.
// #
// #  You should have received a copy of the GNU General Public License
// #  along with this program; if not, write to the Free Software
// #  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
//
// #
// # $Id$
// #
// # cubrid.conf
// #
// # For complete information on parameters, see the CUBRID
// # Database Administration Guide chapter on System Parameters
//
//
//     `
// const sectionComment = {
//     service: {
//         header: `# Service section - a section for 'cubrid service' command`,
//         children: {
//             service: `# The list of processes to be started automatically by 'cubrid service start' command
// # Any combinations are available with server, broker and manager.`
//         }
//     },
//     common:{
//         header: `# Common section - properties for all databases
// # This section will be applied before other database specific sections.`,
//         children: {
//             max_clients: `# The maximum number of concurrent client connections the server will accept.
// # This value also means the total # of concurrent transactions.`,
//             cubrid_port_id: `# TCP port id for the CUBRID programs (used by all clients).`,
//             backup_volume_max_size_bytes: `# This parameter places an upper limit on the size in bytes of the backup volumes created with the backupdb utility.
// # This can be used to segment a backup into multiple backup volumes.
// # nIt should be set only when needed. When this parameter is not set or set to default(-1),
// # backup volumes will be as large as the destination media allows.`,
//             log_buffer_size: `# Size of log buffer use K, M, G, T unit`,
//             java_stored_procedure: `# Enable Java Stored Procedure`,
//             sort_buffer_size: `# Size of sort buffer are using K, M, G, T unit
// # The sort buffer should be allocated per thread.
// # So, the max size of the sort buffer is sort_buffer_size * max_clients.`,
//             auto_restart_server: `# Restart the server process automatically`,
//             data_buffer_size: `# Size of data buffer use K, M, G, T unit`,
//
//         }
//     }
//
// }
//
//     let lines = []
//     lines.push(header)
//     Object.keys(data).filter(res=> res !== "comment").forEach(key => {
//         lines.push(``);
//         let comment = sectionComment[key]?.header;
//         if(comment) {
//             lines.push(comment);
//
//         }
//         lines.push(`[${key}]`)
//         for(const name in data[key]){
//             let comment = sectionComment[key]?.children?.[name];
//             if(comment){
//                 lines.push(comment);
//             }
//             if(data[key][name]){
//                 lines.push(`${name}=${data[key][name]}`);
//                 lines.push("");
//             }
//
//         }
//     })
//     lines.push(``);
//     return lines
// }
//
//
// export function extractSQL(logText) {
//     // Regex to match SQL statements that start with common keywords
//     const sqlRegex = /\b(CREATE|ALTER|INSERT|UPDATE|DELETE|SELECT|DROP|TRUNCATE)\b[\s\S]*?(?=$|\r?\n)/gi;
//
//     let statements = [];
//     let match;
//     while ((match = sqlRegex.exec(logText)) !== null) {
//         let stmt = match[0].trim();
//
//         // Skip lines that are not valid SQL
//         if (!stmt.toLowerCase().startsWith("error")) {
//             statements.push(stmt);
//         }
//     }
//
//     return statements;
// }