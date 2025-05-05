// store/statSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatState = {
  debugString: string;
};

const initialState: StatState = {
  debugString: "",
};

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    updateStatSuccess: (state, action: PayloadAction<string>) => {
      state.debugString = action.payload;
    },
  },
});

export const { updateStatSuccess } = statSlice.actions;
export default statSlice.reducer;
