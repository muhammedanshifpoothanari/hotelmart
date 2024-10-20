import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: '',
    cart:[],
    category: [],
    subcategory: [],
}

const preferenceSlice = createSlice({
    name: "preferenceState",
    initialState,
    reducers: {
        setPreferenceStateReducer(state, action) {
            if(action.payload.type) {
                state.industry = action.payload.industry;
            }
            if(action.payload.category) {
                state.category = action.payload.category;
            }
            if(action.payload.subcategory) {
                state.subcategory = action.payload.subcategory;
            }
        },
    }
})

export const { setPreferenceStateReducer } = preferenceSlice.actions
export const preferenceReducer = preferenceSlice.reducer;
