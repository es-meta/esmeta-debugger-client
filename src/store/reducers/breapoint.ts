import { Breakpoint, BreakpointType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BreakpointState = {
  items: Breakpoint[];
};

const initialState: BreakpointState = {
  items: [],
};

const breakpointSlice = createSlice({
  name: "breakpoint",
  initialState,
  reducers: {
    addBreak: (state, action: PayloadAction<Breakpoint>) => {
      state.items.push(action.payload);
    },
    rmBreak: (state, action: PayloadAction<string | number>) => {
      if (action.payload === "all") {
        state.items = [];
      } else {
        state.items.splice(Number(action.payload), 1);
      }
    },
    toggleBreak: (state, action: PayloadAction<string | number>) => {
      if (action.payload === "all") {
        state.items.forEach(bp => (bp.enabled = !bp.enabled));
      } else {
        const i = Number(action.payload);
        state.items[i].enabled = !state.items[i].enabled;
      }
    },
  },
});

export const { addBreak, rmBreak, toggleBreak } = breakpointSlice.actions;
export default breakpointSlice.reducer;

// helper functions
export function serialize(bp: Breakpoint) {
  let data: [boolean, number, number[], boolean];
  if (bp.type == BreakpointType.Spec) {
    const { fid, steps, enabled } = bp;
    data = [false, fid, steps, enabled];
  } else {
    const { line, enabled } = bp;
    data = [true, line, [], enabled];
  }
  return data;
}
