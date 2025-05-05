// store/specSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IrToSpecMapping, SpecVersion } from "@/types";

export type SpecState = {
  nameMap: Record<string, number>;
  toggleMap: Record<string, boolean>; // TODO: remove
  irToSpecMapping: IrToSpecMapping;
  version: {
    spec: SpecVersion;
    esmeta: string | null;
    client: string;
  };
};

const initialState: SpecState = {
  nameMap: {},
  toggleMap: {},
  irToSpecMapping: {},
  version: {
    spec: {
      hash: null,
      tag: null,
    },
    esmeta: null,
    client: __APP_VERSION__,
  },
};

const specSlice = createSlice({
  name: "spec",
  initialState,
  reducers: {
    updateAlgoListSuccess: (
      state,
      action: PayloadAction<{
        nameMap: Record<string, number>;
        irToSpecMapping: IrToSpecMapping;
      }>,
    ) => {
      state.nameMap = action.payload.nameMap;
      state.irToSpecMapping = action.payload.irToSpecMapping;
    },
  },
});

export const { updateAlgoListSuccess } = specSlice.actions;

export default specSlice.reducer;
