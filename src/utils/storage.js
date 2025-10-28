// Save data to localStorage
import {isNotEmpty} from "@/utils/utils";
import {nanoid} from "nanoid";
import React from "react";
import {getServerFormat} from "@/utils/navigation";

export const setLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Get data from localStorage
export const getLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

export const createServerFormat =(server)=>{
    const item = server
    const id = nanoid(8)
    item["key"] = id
    item["title"] = item["name"]
    item["serverId"] = id
    item["type"] = "server"
    item["icon"] = <i className="fa-light fa-server success"/>
    item["isLeaf"] = false
    return item;
}

export const getLocalConnections = () => {
    if (typeof window !== "undefined") {
        let data = localStorage.getItem("connections");
        data = data?JSON.parse(data):[];
        if(isNotEmpty(data)) {
            return data.map(item => {
                return {...getServerFormat(item), serverId: item.serverId};
            });

        }
    }
    return []
};


export const appendToLocalStorage = (key, newItem) => {
    if (typeof window !== "undefined") {
        let existingData = getLocalStorage(key);
        if (!Array.isArray(existingData)) {
            existingData = []; // Initialize as array if empty or not an array
        }
        const updatedData = [...existingData, newItem]; // Append new item
        setLocalStorage(key, updatedData); // Save updated array
    }
};