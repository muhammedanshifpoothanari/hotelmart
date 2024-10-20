import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
    clicked: '/',
}

const clickSlice = createSlice({
    name: "clickState",
    initialState,
    reducers: {
        setClickStateReducer(state, action) {
            if(action.payload.clicked) {
                state.clicked = action.payload.clicked;
            }
        },
    }
})

export const { setClickStateReducer } = clickSlice.actions
export const clickReducer = clickSlice.reducer;
