/// <reference lib="webworker" />

// import type { ApiMessageData } from './message.type';
import type {
  ScalaJSDebuggerService,
  ScalaJSFactoryInput,
} from "./esmeta.type";

//////////////////////// import from Scala.js /////////////////////////

// suppress for now
const module = new Promise<{
  DebuggerServiceFactory: {
    buildFromGiven: (input: ScalaJSFactoryInput) => Promise<ScalaJSDebuggerService>;
  };
}>((resolve) => resolve({
  DebuggerServiceFactory: {
    buildFromGiven: async (input: ScalaJSFactoryInput) => {
      return Promise.reject(null);
    },
  },
})); // import("@esmeta/main.mjs");

let ESMetaDebugger: Promise<ScalaJSDebuggerService> = Promise.reject(null);

// OLD CODE
// (async () => {
//   const [factory, input] = await Promise.all([
//     import("@esmeta/main.mjs"),
//     fetchFromDump("/dump/funcs.json"),
//     fetchFromDump("/dump/spec.version.json"),
//     fetchFromDump("/dump/grammar.json"),
//     fetchFromDump("/dump/spec.tables.json"),
//     fetchFromDump("/dump/tyModel.decls.json"),
//     fetchFromDump("/dump/irFuncToCode.json"),
//   ]).then(
//     ([module, funcs, version, grammar, tables, tyModel, irFuncToCode]) =>
//       [
//         module.DebuggerServiceFactory,
//         {
//           funcs,
//           version,
//           grammar,
//           tables,
//           tyModel,
//           irFuncToCode,
//         },
//       ] satisfies [unknown, ScalaJSFactoryInput],
//   );

//   const mokcing = await factory.buildFromGiven(input);
//   return mokcing;
// })();

////////////////////////////////////////////////////////////////////////

const apiError = (s: string) => new Error(`Unknown API endpoint ${s}`);

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
      return JSON.parse((await ESMetaDebugger).spec_func());

    case "spec/version":
      return JSON.parse((await ESMetaDebugger).spec_version());

    case "state/heap":
      return JSON.parse((await ESMetaDebugger).state_heap());

    case "state/callStack":
      return JSON.parse((await ESMetaDebugger).state_callStack());

    default:
      if (endpoint.startsWith("state/context/")) {
        return JSON.parse(
          (await ESMetaDebugger).state_context(
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
      console.log("got breakpoint request");
      switch (method) {
        case "POST":
          return JSON.parse(
            (await ESMetaDebugger).breakpoint_add(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        case "DELETE":
          return JSON.parse(
            (await ESMetaDebugger).breakpoint_remove(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        case "PUT":
          return JSON.parse(
            (await ESMetaDebugger).breakpoint_toggle(
              bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
            ),
          );
        default:
          throw apiError(endpoint);
      }

    case "exec/run":
      return JSON.parse(
        (await ESMetaDebugger).exec_run(
          bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
        ),
      );

    case "exec/specStep":
      return JSON.parse((await ESMetaDebugger).exec_step());
    case "exec/specStepOver":
      return JSON.parse((await ESMetaDebugger).exec_stepOver());

    case "exec/specStepOut":
      return JSON.parse((await ESMetaDebugger).exec_stepOut());

    case "exec/specContinue":
      return JSON.parse((await ESMetaDebugger).exec_continue());

    case "exec/specStepBack":
      return JSON.parse((await ESMetaDebugger).exec_stepBack());

    case "exec/specStepBackOut":
      return JSON.parse((await ESMetaDebugger).exec_stepBackOut());

    case "exec/specStepBackOver":
      return JSON.parse((await ESMetaDebugger).exec_stepBackOver());

    // TODO
    // case "exec/esStep":
    //   return JSON.parse((await ESMetaDebugger).exec_esStep());
    case "exec/esStepOver":
      return JSON.parse((await ESMetaDebugger).exec_esStepOver());

    case "exec/esStepOut":
      return JSON.parse((await ESMetaDebugger).exec_esStepOut());

    default:
      throw apiError(endpoint);
  }
};

self.onmessage = async (e: MessageEvent<any>) => {
  const { id, type, endpoint, data } = e.data;

  try {
    let result;
    switch (type) {
      case "META":
        ESMetaDebugger = (
          await module
        ).DebuggerServiceFactory.buildFromGiven(data);
        await ESMetaDebugger;
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
