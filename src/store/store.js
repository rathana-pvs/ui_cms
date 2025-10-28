import rootReducer from "@/store/rootReducer";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: rootReducer
});
