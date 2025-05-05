import { FALLBACK_CODE, SEARCHPARAM_NAME_PROG } from "@/constants";
import { getSearchQuery } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type JsState = {
  code: string;
};

const initialState: JsState = {
  code: getSearchQuery(SEARCHPARAM_NAME_PROG) ?? FALLBACK_CODE,
};

const jsSlice = createSlice({
  name: "js",
  initialState,
  reducers: {
    forceEdit: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { forceEdit } = jsSlice.actions;
export default jsSlice.reducer;
