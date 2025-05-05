// hooks.ts (new file)
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { ReduxState, AppDispatch } from "@/store";
export { shallowEqual } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;
