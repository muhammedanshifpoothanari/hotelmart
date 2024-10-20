import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: '',
    jobTitle: '',
    fieldOfStudy: '',
    salaryRangeLow: 0,
    salaryRangeHigh: 0,
    skills: [],
    softSkills: [],
}

const filterSlice = createSlice({
    name: "filterState",
    initialState,
    reducers: {
        setFilterStateReducer(state, action) {
            if(action.payload.type) {
                state.type = action.payload.type;
            }
            if(action.payload.jobTitle) {
                state.jobTitle = action.payload.jobTitle;
            }
            if(action.payload.skills) {
                state.skills = action.payload.skills;
            }
            if(action.payload.salaryRangeLow) {
                state.salaryRangeLow = action.payload.salaryRangeLow;
            }
            if(action.payload.salaryRangeHigh) {
                state.salaryRangeHigh = action.payload.salaryRangeHigh;
            }
            if(action.payload.fieldOfStudy) {
                state.fieldOfStudy = action.payload.fieldOfStudy;
            }
            
        },
    }
})

export const { setFilterStateReducer } = filterSlice.actions
export const filterReducer = filterSlice.reducer;
