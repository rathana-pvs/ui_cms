// utils/getFromStore.js
import { store } from "@/store/store"; // adjust path to your store

/**
 * Call a Redux selector outside React components
 * @param {Function} selector - Redux selector function
 * @returns {*} The selected state value
 */
export function getFromStore(selector) {
    const state = store.getState();
    return selector(state);
}

export const selectTreeReducer = (state) => state.treeReducer;