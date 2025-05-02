import { toast } from "react-toastify";
import type { Route } from "@/types";
import type { StandaloneDebuggerInput } from "./standalone.type";
import { jotaiStore } from "@/atoms/store";
import { recieveAtom, sentAtom } from "@/atoms/defs";
import { createIdGenerator, logger } from "@/utils";
import type { ExtractAtomValue } from "jotai";
import { givenConfigAtom } from "@/atoms/defs/config";

// Create worker instance
const workerPromise = instantiateWorker(jotaiStore.get(givenConfigAtom).api);

// Request counter for unique IDs
const newId = createIdGenerator();

export const workingset = new Set();

type ReturnTypeForApi<T extends Route> = T extends "state/heap"
  ? number
  : unknown;

export const createWorkerRequest = async <T extends Route>(
  workerPromise: Promise<Worker>,
  type: "GET" | "POST" | "DELETE" | "PUT",
  endpoint: T,
  data?: unknown,
): Promise<ReturnTypeForApi<T>> => {
  const worker = await workerPromise;
  return new Promise((resolve, reject) => {
    const id = newId();
    workingset.add(id);
    jotaiStore.set(sentAtom);

    logger.log(id, type, endpoint, data);

    const handler = (e: MessageEvent) => {
      const response = e.data;
      if (response.id === id) {
        worker.removeEventListener("message", handler);
        logger.log(id, response);
        if (response.success) {
          resolve(response.data);
          workingset.delete(id);
          jotaiStore.set(recieveAtom, workingset.size);
        } else {
          workingset.delete(id);
          jotaiStore.set(recieveAtom, Number.MIN_SAFE_INTEGER);
          const error = new Error(response.error);
          toast.error(error.message);
          reject(error);
        }
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
  return createWorkerRequest<T>(workerPromise, "GET", endpoint, queryObj);
};

export const doAPIPostRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest<T>(workerPromise, "POST", endpoint, bodyObj);
};

export const doAPIDeleteRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest(workerPromise, "DELETE", endpoint, bodyObj);
};

export const doAPIPutRequest = <T extends Route>(
  endpoint: T,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest(workerPromise, "PUT", endpoint, bodyObj);
};

/** auxiliaries */
export async function instantiateWorker(
  givenApi: ExtractAtomValue<typeof givenConfigAtom>["api"],
): Promise<Worker> {
  return new Promise<Worker>(async resolve => {
    if (givenApi.type === "browser") {
      const w = new Worker(new URL("./standalone.worker.ts", import.meta.url));

      const input = await Promise.all([
        fetchText(new URL("@resources/dumps/funcs.json", import.meta.url)),
        fetchText(
          new URL("@resources/dumps/spec.version.json", import.meta.url),
        ),
        fetchText(new URL("@resources/dumps/grammar.json", import.meta.url)),
        fetchText(
          new URL("@resources/dumps/spec.tables.json", import.meta.url),
        ),
        fetchText(
          new URL("@resources/dumps/tyModel.decls.json", import.meta.url),
        ),
        fetchText(
          new URL("@resources/dumps/irToSpecNameMap.json", import.meta.url),
        ),
      ]).then(
        ([funcs, version, grammar, tables, tyModel, irToSpecNameMap]) =>
          ({
            funcs,
            version,
            grammar,
            tables,
            tyModel,
            irToSpecNameMap,
          }) satisfies StandaloneDebuggerInput,
      );

      function firstEventHandlerStandalone() {
        w.removeEventListener("message", firstEventHandlerStandalone);
        resolve(w);
      }

      w.addEventListener("message", firstEventHandlerStandalone);
      w.postMessage({ type: "META", data: input });

      resolve(w);
    } else {
      const w = new Worker(new URL("./http.worker.ts", import.meta.url));

      function firstEventHandlerHttp() {
        w.removeEventListener("message", firstEventHandlerHttp);
        resolve(w);
      }

      w.addEventListener("message", firstEventHandlerHttp);
      w.postMessage({ type: "META", data: givenApi.url });
      // TODO we need to await for the worker to be ready
    }
  });
}

function fetchText(url: URL): Promise<string> {
  return fetch(url).then(response => response.text());
}
