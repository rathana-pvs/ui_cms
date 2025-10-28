import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    themeMode: "light",
};

const dialogReducer = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        setThemeMode: (state, action) => {
            state.themeMode = action.payload;
        }
    },
});

export const {setThemeMode } = dialogReducer.actions;
export default dialogReducer.reducer;