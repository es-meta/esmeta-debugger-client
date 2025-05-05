import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "@/types";

// state type
type AppStateState = {
  state: AppState;
  busy: number | null;
  ignoreBP: boolean;
  devMode: boolean;
};

const initialState: AppStateState = {
  state: AppState.INIT,
  busy: null,
  ignoreBP: false,
  devMode: import.meta.env.DEV,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    move: (state, action: PayloadAction<AppState>) => {
      state.state = action.payload;
    },
    setBusy: (state, action: PayloadAction<number>) => {
      state.busy = action.payload;
    },
    toggleIgnore: state => {
      state.ignoreBP = !state.ignoreBP;
    },
    toggleDevMode: state => {
      state.devMode = !state.devMode;
    },
  },
});

export const { move, setBusy, toggleIgnore, toggleDevMode } =
  appStateSlice.actions;

export default appStateSlice.reducer;
