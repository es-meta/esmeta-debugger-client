import {
  AppState,
  CallStack,
  Context,
  StepResult,
  StepResultAdditional,
  type Heap,
} from "@/types";
import { atom } from "jotai";
import { appState } from "./app";
import { toast } from "react-toastify";
import { es } from "@/utils";
import { AST } from "@/types/ast.types";

const initialState: StepResultAdditional = {
  reprint: null,
  callstack: [],
  // heap: {},
  stepCnt: 0,
  result: StepResult.REACHEDFRONT,
  ast: null,
  heap: {},
  instCnt: 0,
};

const _real_innerPromise = atom<[boolean, StepResultAdditional | null]>([
  false,
  null,
]);

const _innerPromise = atom<
  [boolean, StepResultAdditional | null],
  [[boolean, StepResultAdditional | null]],
  void
>(
  get => {
    return get(_real_innerPromise);
  },
  (get, set, update: [boolean, StepResultAdditional | null]) => {
    set(_real_innerPromise, update);
    const [, res] = update;
    if (res === null) {
      set(astAtom, null);
    } else if (res?.ast) {
      set(astAtom, res?.ast);
    }
  },
);

export const astAtom = atom<AST | null>(null);

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const resultAtom = atom<
  [boolean, StepResultAdditional, boolean],
  [update: Promise<StepResultAdditional> | null],
  void
>(
  get => {
    const [isPending, res] = get(_innerPromise);
    const isEmpty = res === null;
    return [isPending, res ?? initialState, isEmpty];
  },
  async (get, set, update: Promise<StepResultAdditional> | null) => {
    await timeout(0);
    set(appState, AppState.DEBUG_READY);
    if (update === null) {
      set(_innerPromise, [false, null]);
      set(appState, AppState.JS_INPUT);
      set(contextIdxAtom, 0);
    } else {
      const old = get(_innerPromise);
      set(_innerPromise, [true, old[1]]);
      update.then(res => {
        set(_innerPromise, [false, res]);
        set(contextIdxAtom, 0);
        switch (res.result) {
          case StepResult.BREAKED:
            toast.info("Execution stopped at breakpoint");
            set(appState, AppState.DEBUG_READY);
            break;
          case StepResult.TERMINATED:
            toast.info("Terminated");
            set(appState, AppState.TERMINATED);
            break;
          case StepResult.SUCCEED:
            // toast.success("Success");
            break;
          case StepResult.REACHEDFRONT:
            toast.info("Execution reached the front");
            set(appState, AppState.DEBUG_READY_AT_FRONT);
            break;
        }
      });
    }
  },
);

export const reprintAtom = atom<Maybe<string>>(get => {
  const [, { reprint }] = get(resultAtom);
  return reprint;
});

export const callstackAtom = atom<CallStack>(get => {
  const [, { callstack }] = get(resultAtom);
  return callstackFromRaw(callstack);
});

export const contextIdxAtom = atom<number>(0);

export const contextAtom = atom<Context | undefined>(get => {
  const callstack = get(callstackAtom);
  const idx = get(contextIdxAtom);
  const context = callstack[idx];
  return context;
});

export const heapAtom = atom<Heap>(get => {
  // read inner promise atom, to make it depend on it and re-evaluate when it changes
  const [, { heap }] = get(resultAtom);
  return heap;
});

export const esExecutionStack = atom(get => {
  const heap = get(heapAtom);
  return es.readJSExecutionStack(heap);
});

export const esEnvAtom = atom(get => {
  const heap = get(heapAtom);
  return es.computeESEnv(heap);
});

export const instCntAtom = atom<number>(get => {
  const [, { instCnt }] = get(resultAtom);
  return instCnt;
});

function callstackFromRaw(raw: StepResultAdditional["callstack"]): CallStack {
  return raw.map(
    ([fid, steps, isExit, env, visited, dot, [start, end]]) =>
      ({
        fid,
        steps,
        isExit,
        env,
        algoDot: dot,
        visited,
        jsRange: [start, end],
      }) satisfies Context,
  );
}
