import { createSlice } from "@reduxjs/toolkit";

const initialState: CounterInitState = {
  activeRowId: null,
  counter: 0,
  isRunning: false,
  user: null,
};

export const counterReducer = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state) => {
      if (state.isRunning) {
        state.counter = state.counter + 1;
      }
    },

    startCounter: (state, action) => {
      state.activeRowId = action.payload;
      state.isRunning = true;
    },

    updateCounter: (state, action) => {
      state.counter = action.payload;
    },

    stopCounter: (state) => {
      state.isRunning = false;
    },

    resetCounter: (state) => {
      state.isRunning = false;
      state.counter = 0;
      state.activeRowId = null;
    },
  },
});

export const {
  increament,
  startCounter,
  stopCounter,
  resetCounter,
  updateCounter,
} = counterReducer.actions;




