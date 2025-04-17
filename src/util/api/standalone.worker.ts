/// <reference lib="webworker" />

import type {
  ModuleGeneratedByScalaJS,
  StandaloneDebugger,
  StandaloneDebuggerInput,
} from "./standalone.type";

let input: StandaloneDebuggerInput | null = null;

let { resolve, promise: _standaloneDebugger } =
  Promise.withResolvers<StandaloneDebugger>();

// HTTP methods
type HTTPMethod =
  | "META"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "OPTIONS";

// raw GET request
const doGetRequest = async (
  endpoint: Route,
  queryObj?: { [key: string]: unknown },
): Promise<unknown> => {
  switch (endpoint) {
    case "spec/func":
      return JSON.parse((await _standaloneDebugger).spec_func());

    case "meta/version":
      return JSON.parse((await _standaloneDebugger).meta_version());

    case "meta/iter":
      return 1;

    case "meta/debugString":
      return "";

    case "spec/irToSpecNameMap":
      return JSON.parse(
        ((await input) as StandaloneDebuggerInput).irToSpecNameMap,
      );

    case "spec/version":
      return JSON.parse((await _standaloneDebugger).spec_version());

    case "state/heap":
      return JSON.parse((await _standaloneDebugger).state_heap());

    case "state/callStack":
      return JSON.parse((await _standaloneDebugger).state_callStack());

    default:
      if (endpoint.startsWith("state/context/")) {
        return JSON.parse(
          (await _standaloneDebugger).state_context(
            Number(endpoint.split("/").at(2)),
          ),
        );
      }

      throw apiError(endpoint);
  }
};

import { Route } from "@/types/route.type";

// raw POST-like request
const doWriteRequest = async (
  method: HTTPMethod,
  endpoint: Route,
  bodyObj?: string,
): Promise<unknown> => {
  switch (endpoint) {
    case "breakpoint":
      switch (method) {
        case "POST":
          return JSON.parse(
            (await _standaloneDebugger).breakpoint_add(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        case "DELETE":
          return JSON.parse(
            (await _standaloneDebugger).breakpoint_remove(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        case "PUT":
          return JSON.parse(
            (await _standaloneDebugger).breakpoint_toggle(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        default:
          throw apiError(endpoint);
      }

    case "exec/run":
      return JSON.parse(
        (await _standaloneDebugger).exec_run(
          bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
        ),
      );

    case "exec/resumeFromIter":
      return JSON.parse(
        (await _standaloneDebugger).exec_resumeFromIter(
          bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
        ),
      );

    case "exec/backToProvenance":
      return JSON.parse(
        (await _standaloneDebugger).exec_backToProvenance(
          bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
        ),
      );

    case "exec/specStep":
      return JSON.parse(
        (await _standaloneDebugger).exec_step(coerceBoolean(bodyObj)),
      );
    case "exec/specStepOver":
      return JSON.parse(
        (await _standaloneDebugger).exec_stepOver(coerceBoolean(bodyObj)),
      );

    case "exec/specStepOut":
      return JSON.parse(
        (await _standaloneDebugger).exec_stepOut(coerceBoolean(bodyObj)),
      );

    case "exec/specContinue":
      return JSON.parse((await _standaloneDebugger).exec_continue());

    case "exec/specRewind":
      return JSON.parse((await _standaloneDebugger).exec_rewind());

    case "exec/specStepBack":
      return JSON.parse(
        (await _standaloneDebugger).exec_stepBack(coerceBoolean(bodyObj)),
      );

    case "exec/specStepBackOut":
      return JSON.parse(
        (await _standaloneDebugger).exec_stepBackOut(coerceBoolean(bodyObj)),
      );

    case "exec/specStepBackOver":
      return JSON.parse(
        (await _standaloneDebugger).exec_stepBackOver(coerceBoolean(bodyObj)),
      );

    case "exec/esAstStep":
      return JSON.parse((await _standaloneDebugger).exec_esAstStep());

    case "exec/esStatementStep":
      return JSON.parse((await _standaloneDebugger).exec_esStatementStep());

    case "exec/esStepOver":
      return JSON.parse((await _standaloneDebugger).exec_esStepOver());

    case "exec/esStepOut":
      return JSON.parse((await _standaloneDebugger).exec_esStepOut());

    case "exec/irStep":
      return JSON.parse(
        (await _standaloneDebugger).exec_irStep(coerceBoolean(bodyObj)),
      );

    case "exec/irStepOver":
      return JSON.parse(
        (await _standaloneDebugger).exec_irStepOver(coerceBoolean(bodyObj)),
      );

    case "exec/irStepOut":
      return JSON.parse(
        (await _standaloneDebugger).exec_irStepOut(coerceBoolean(bodyObj)),
      );

    case "exec/iterPlus":
      return JSON.parse(
        (await _standaloneDebugger).exec_iterPlus(coerceBoolean(bodyObj)),
      );

    case "exec/iterMinus":
      return JSON.parse(
        (await _standaloneDebugger).exec_iterMinus(coerceBoolean(bodyObj)),
      );

    default:
      throw apiError(endpoint);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.onmessage = async (e: MessageEvent<any>) => {
  const { id, type, endpoint, data } = e.data;

  try {
    let result;
    switch (type) {
      case "META":
        // input = data as StandaloneDebuggerInput;
        // await import("@esmeta-debug/main.mjs").then(async m =>
        //   resolve(
        //     await (m as ModuleGeneratedByScalaJS).StandaloneDebugger.// buildFrom(
        //       input as StandaloneDebuggerInput,
        //     ),
        //   ),
        // );
        await _standaloneDebugger;
        break;
      case "GET":
        result = await doGetRequest(endpoint, data);
        break;
      case "POST":
      case "PUT":
      case "DELETE":
        result = await doWriteRequest(type, endpoint, data);
        break;
      default:
        throw new Error(`Unsupported request type: ${type}`);
    }

    self.postMessage({ id, success: true, data: result });
  } catch (error) {
    console.error("error", error);
    self.postMessage({
      id,
      success: false,
      error: (error as Error).message,
    });
  }
};

/** auxiliaries */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function coerceBoolean(bodyObj: any): boolean {
  if (typeof bodyObj === "boolean") return bodyObj;
  console.error("Invalid boolean value:", bodyObj);
  return false;
}

function apiError(s: string) {
  return new Error(`Unknown API endpoint ${s}`);
}
