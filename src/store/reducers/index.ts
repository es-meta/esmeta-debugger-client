import { combineReducers } from "redux";
import appState from "./app-state";
import breakpoint from "./breapoint";
import js from "./js";
import ir from "./ir";
import stats from "./stats";

const rootReducer = combineReducers({
  appState,
  breakpoint,
  ir,
  js,
  stats,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
