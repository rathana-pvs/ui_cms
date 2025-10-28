import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: {},

};

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
});

export const {setUser } = authReducer.actions;
export default authReducer.reducer;