import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    mobileNumber: null
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthReducer(state, action) {
           state.token = action.payload.token;
           state.mobileNumber = action.payload.mobileNumber;
        },
    }
})


export const { setAuthReducer } = authSlice.actions
export const authReducer = authSlice.reducer;