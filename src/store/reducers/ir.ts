// store/IrState.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Heap, CallStack } from "@/types";

type IrStateState = {
  contextIdx: number;
  callStack: CallStack;
  heap: Heap;
};

const initialState: IrStateState = {
  contextIdx: 0,
  callStack: [],
  heap: {},
};

const irStateSlice = createSlice({
  name: "irState",
  initialState,
  reducers: {
    updateContextIdx: (state, action: PayloadAction<number>) => {
      state.contextIdx = action.payload;
    },
    updateHeapSuccess: (state, action: PayloadAction<Heap>) => {
      state.heap = action.payload;
    },
    updateCallStackSuccess: (state, action: PayloadAction<CallStack>) => {
      state.callStack = action.payload;
    },
    clearIrState: state => {
      state.contextIdx = 0;
      state.callStack = [];
      state.heap = {};
    },
  },
});

// Export action creators
export const {
  updateContextIdx,
  updateHeapSuccess,
  updateCallStackSuccess,
  clearIrState,
} = irStateSlice.actions;

// Export reducer
export default irStateSlice.reducer;
