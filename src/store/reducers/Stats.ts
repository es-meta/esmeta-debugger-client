// store/statSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatState = {
  iter: number | null;
  debugString: string;
};

const initialState: StatState = {
  iter: null,
  debugString: "",
};

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    updateStatSuccess: (
      state,
      action: PayloadAction<[number | null, string]>,
    ) => {
      const [iter, debugString] = action.payload;
      state.iter = iter;
      state.debugString = debugString;
    },
  },
});

export const { updateStatSuccess } = statSlice.actions;
export default statSlice.reducer;
