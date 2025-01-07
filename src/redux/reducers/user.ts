import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const initialState: UserReducerInitState = {
    loading: true,
    user: null
}

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload
        },

        userNotExist: (state) => {
            state.loading = false;
            state.user = null
        },

        userTaskUpdated: (state, action) => {
            state.loading = false;
            state.user!.tasks = action.payload
        },
        setUser:(state,action)=>{
            state.user = action.payload
        }


    }
});

export const { userExist, userNotExist,userTaskUpdated,setUser } = userReducer.actions