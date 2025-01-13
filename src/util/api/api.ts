import { toast } from "react-toastify";
import type { Route } from "@/types/route.type";
import { GIVEN_SETTINGS } from "@/constants/settings";
import { ScalaJSFactoryInput } from "./esmeta.type";
import { logger } from "@/constants/constant";

function fetchFromDump(url: string): Promise<string> {
  return fetch(url).then(response => response.text());
}

// Create worker instance
const workerPromise = new Promise<Worker>((resolve) => {
  const GIVEN_API = GIVEN_SETTINGS.api;
  if (GIVEN_API.type === "browser") {

    const input = Promise.all([
      fetchFromDump("/dump/funcs.json"),
      fetchFromDump("/dump/spec.version.json"),
      fetchFromDump("/dump/grammar.json"),
      fetchFromDump("/dump/spec.tables.json"),
      fetchFromDump("/dump/tyModel.decls.json"),
      fetchFromDump("/dump/irFuncToCode.json"),
    ]).then(
      ([funcs, version, grammar, tables, tyModel, irFuncToCode]) =>
        ({
          funcs,
          version,
          grammar,
          tables,
          tyModel,
          irFuncToCode,
        }) satisfies ScalaJSFactoryInput,
    );

    const w = new Worker(new URL("./esmeta.worker.ts", import.meta.url));
    w.postMessage({ type: "META", data: input });
    resolve(w);
  } else {
    const w = new Worker(new URL("./http.worker.ts", import.meta.url));
    w.postMessage({ type: "META", data: GIVEN_API.url });
    resolve(w);
  }
});

// Request counter for unique IDs
// XXX if need better atomics const ta = new Uint8Array(new SharedArrayBuffer(1));
var counter = 0;
export const workingset = new Set();

// Helper function to handle worker communication

type ReturnTypeForApi<T extends Route> = T extends "state/heap"
  ? number
  : unknown;

const createWorkerRequest = async <T extends Route>(
  type: string,
  endpoint: T,
  data?: unknown,
): Promise<ReturnTypeForApi<T>> => {
    const worker = await workerPromise;
    return new Promise((resolve, reject) => {
      const id = counter++;
      workingset.add(id);

      logger.log(id, type, endpoint, data);

      const handler = (e: MessageEvent) => {
        const response = e.data;
        if (response.id === id) {
          worker.removeEventListener("message", handler);
          logger.log(id, response);
          if (response.success) {
            resolve(response.data);
          } else {
            const error = new Error(response.error);
            toast.error(error.message);
            reject(error);
          }
          workingset.delete(id);
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({ id, type, endpoint, data });
    });
};

// Modified API request functions
export const doAPIGetRequest = <T extends Route>(
  endpoint: T,
  queryObj?: { [key: string]: unknown },
) => {
  return createWorkerRequest<T>("GET", endpoint, queryObj);
};

export const doAPIPostRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest<T>("POST", endpoint, bodyObj);
};

export const doAPIDeleteRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest("DELETE", endpoint, bodyObj);
};

export const doAPIPutRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest("PUT", endpoint, bodyObj);
};
