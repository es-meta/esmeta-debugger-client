import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { atoms, jotaiStore } from "@/atoms";
import { AppState } from "@/types";

// state type
type AppStateState = {
  state: AppState;
  ignoreBP: boolean;
};

const initialState: AppStateState = {
  state: AppState.INIT,
  ignoreBP: false,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    move: (state, action: PayloadAction<AppState>) => {
      jotaiStore.set(atoms.app.appState, action.payload);
      state.state = action.payload;
    },
    toggleIgnore: state => {
      state.ignoreBP = !state.ignoreBP;
    },
  },
});

export const { move, toggleIgnore } = appStateSlice.actions;

export default appStateSlice.reducer;
