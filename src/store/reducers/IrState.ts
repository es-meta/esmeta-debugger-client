import { Heap } from "@/types/heap.type";
import produce from "immer";
import { Algorithm } from "./Spec";

// redux actions
export enum IrStateActionType {
  CLEAR = "IrStateAction/CLEAR",
  UPDATE_CONTEXT_INDEX = "IrStateAction/UPDATE_CONTEXT_INDEX",
  UPDATE_HEAP_REQUEST = "IrStateAction/UPDATE_HEAP_REQUEST",
  UPDATE_HEAP_SUCCESS = "IrStateAction/UPDATE_HEAP_SUCCESS",
  UPDATE_CALL_STACK_REQUEST = "IrStateAction/UPDATE_CALL_STACK_REQUEST",
  UPDATE_CALL_STACK_SUCCESS = "IrStateAction/UPDATE_CALL_STACK_SUCCESS",
}
export const clearIrState = (): IrStateAction => ({
  type: IrStateActionType.CLEAR,
});
export const updateContextIdx = (idx: number): IrStateAction => ({
  type: IrStateActionType.UPDATE_CONTEXT_INDEX,
  idx,
});
export const updateHeapRequest = (): IrStateAction => ({
  type: IrStateActionType.UPDATE_HEAP_REQUEST,
});
export const updateHeapSuccess = (heap: Heap): IrStateAction => ({
  type: IrStateActionType.UPDATE_HEAP_SUCCESS,
  heap,
});
export const updateCallStackRequest = (): IrStateAction => ({
  type: IrStateActionType.UPDATE_CALL_STACK_REQUEST,
});
export const updateCallStackSuccess = (
  callStack: CallStack,
): IrStateAction => ({
  type: IrStateActionType.UPDATE_CALL_STACK_SUCCESS,
  callStack,
});
export type IrStateAction =
  | { type: IrStateActionType.CLEAR }
  | { type: IrStateActionType.UPDATE_CONTEXT_INDEX; idx: number }
  | { type: IrStateActionType.UPDATE_HEAP_REQUEST }
  | { type: IrStateActionType.UPDATE_HEAP_SUCCESS; heap: Heap }
  | { type: IrStateActionType.UPDATE_CALL_STACK_REQUEST }
  | { type: IrStateActionType.UPDATE_CALL_STACK_SUCCESS; callStack: CallStack };

// name, beautified value
export type Environment = [string, string][];
// context name, current step number, env data
export type Context = {
  fid: number;
  name: string;
  steps: number[];
  env: Environment;
  algo: Algorithm;
  visited: number[][];
};
export type CallStack = Context[];

// redux state
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

export default function reducer(state = initialState, action: IrStateAction) {
  switch (action.type) {
    case IrStateActionType.UPDATE_CONTEXT_INDEX:
      return produce(state, draft => {
        draft.contextIdx = action.idx;
      });
    case IrStateActionType.UPDATE_HEAP_SUCCESS:
      return produce(state, draft => {
        draft.heap = action.heap;
      });
    case IrStateActionType.UPDATE_CALL_STACK_SUCCESS:
      return produce(state, draft => {
        draft.callStack = action.callStack;
      });
    case IrStateActionType.CLEAR:
      return produce(state, draft => {
        draft.contextIdx = 0;
        draft.callStack = initialState.callStack;
        draft.heap = initialState.heap;
      });
    default:
      return state;
  }
}
