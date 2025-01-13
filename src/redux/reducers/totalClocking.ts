import { createSlice } from "@reduxjs/toolkit"


const initialState:TotalClockingInitState = {
    totalClocking: 0
}

export const totalClockingReducer = createSlice({
    name: 'totalClocking',
    initialState,
    reducers: {
        updateTotalClocking: (state, action) => {
            console.log('state of total clocking udated with'+action.payload)
            state.totalClocking = action.payload
        },

        resetTotalClocking :(state)=>{
            state.totalClocking = 0
        }

    }
})


export const {updateTotalClocking,resetTotalClocking} = totalClockingReducer.actions