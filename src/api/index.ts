import { toast } from "react-toastify";
import type { ExtractAtomValue } from "jotai";
import type { Route } from "@/types";
import type { StandaloneDebuggerInput } from "./standalone.type";
import { atoms, jotaiStore } from "@/atoms";
import { createIdGenerator, logger } from "@/utils";
import { busyAtom } from "@/atoms/defs/app";
import { rateAtom } from "./atom";

// Create worker instance
const workerPromise = instantiateWorker(
  jotaiStore.get(atoms.config.givenConfigAtom).api,
);

// Request counter for unique IDs
const newId = createIdGenerator();

const workingset = new Set();

type ReturnTypeForApi<T extends Route> = T extends "state/heap"
  ? unknown
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
    jotaiStore.set(busyAtom, workingset.size);

    logger.log?.(id, type, endpoint, data);

    const handler = (e: MessageEvent) => {
      const response = e.data;
      if (response.id === id) {
        worker.removeEventListener("message", handler);
        logger.log?.(id, response);
        if (response.success) {
          resolve(response.data);
          workingset.delete(id);
          jotaiStore.set(busyAtom, workingset.size);
        } else {
          workingset.delete(id);
          jotaiStore.set(busyAtom, Number.MIN_SAFE_INTEGER);
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
  givenApi: ExtractAtomValue<typeof atoms.config.givenConfigAtom>["api"],
): Promise<Worker> {
  return new Promise<Worker>(async resolve => {
    if (givenApi.type === "browser") {
      const w = new Worker(new URL("./standalone.worker.ts", import.meta.url));

      const input = await Promise.all([
        fetchText(new URL("@resources/dump/debugger/funcs.json", import.meta.url)),
        fetchText(
          new URL("@resources/dump/debugger/spec.version.json", import.meta.url),
        ),
        fetchText(new URL("@resources/dump/debugger/grammar.json", import.meta.url)),
        fetchText(
          new URL("@resources/dump/debugger/spec.tables.json", import.meta.url),
        ),
        fetchText(
          new URL("@resources/dump/debugger/tyModel.decls.json", import.meta.url),
        ),
        fetchText(
          new URL("@resources/dump/debugger/funcs.cfg.json", import.meta.url),
        ),
      ]).then(
        ([funcs, version, grammar, tables, tyModel, funcsCfg]) =>
          ({
            funcs,
            version,
            grammar,
            tables,
            tyModel,
            funcsCfg,
          }) satisfies StandaloneDebuggerInput,
      );

      function firstEventHandlerStandalone(e: MessageEvent) {
        const response = e.data;
        if (!response.id) return; // ignore rate messages
        w.removeEventListener("message", firstEventHandlerStandalone);
        resolve(w);
      }


      function handleRate(e: MessageEvent) {
        const response = e.data;
        if (response.id === undefined && response.type === "RATE") {
          const x = Math.min(response.data, 1);
          jotaiStore.set(rateAtom, x);
          if (x >= 1) {
            w.removeEventListener("message", handleRate);
          }
        }
      }

      w.addEventListener("message", handleRate);
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
