import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SineDataItemInterface } from "../interfaces";

export interface SineCoordinatesState {
  realtime: SineDataItemInterface[];
  log: SineDataItemInterface[];
}

const initialState: SineCoordinatesState = {
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
    updateRealtime: (state, action: PayloadAction<SineDataItemInterface>) => {
      state.realtime.push(action.payload);
    },
    replaceLog: (state, action: PayloadAction<SineDataItemInterface[]>) => {
      state.log = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateRealtime, replaceLog } = sineCoordinatesSlice.actions;

export default sineCoordinatesSlice.reducer;
