import { createSlice } from "@reduxjs/toolkit"


const initialState:TotalClockingInitState = {
    totalClocking: 0
}

export const totalClockingReducer = createSlice({
    name: 'totalClocking',
    initialState,
    reducers: {
        updateTotalClocking: (state, action) => {
            state.totalClocking = action.payload
        }

    }
})


export const {updateTotalClocking} = totalClockingReducer.actions