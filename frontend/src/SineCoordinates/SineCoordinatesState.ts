import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { iSineDatum } from "./SineCoordinatesInterfaces";

export interface iSineCoordinatesState {
  realtime: iSineDatum[];
  log: iSineDatum[];
}

export const initialState: iSineCoordinatesState = {
  realtime: [],
  log: [],
};
export const sineCoordinatesSlice = createSlice({
  name: "sineCoordinates",
  initialState,
  reducers: {
    // NOTE: Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateRealtime: (state, action: PayloadAction<iSineDatum>) => {
      state.realtime.push(action.payload);
    },
    resetRealtime: (state) => {
      state.realtime = [];
    },
    replaceLog: (state, action: PayloadAction<iSineDatum[]>) => {
      state.log = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateRealtime, replaceLog, resetRealtime } =
  sineCoordinatesSlice.actions;

export default sineCoordinatesSlice.reducer;
