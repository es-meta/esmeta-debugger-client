import { toast } from "react-toastify";
import type { Route } from "@/types/route.type";
import { GIVEN_SETTINGS } from "@/constants/settings";

// Create worker instance
const workerPromise = new Promise<Worker>(resolve => {
  const GIVEN_API = GIVEN_SETTINGS.api;
  if (GIVEN_API.type === 'browser') {
    resolve(new Worker(new URL("./esmeta.worker.ts", import.meta.url)));
  } else {
    const w = new Worker(new URL("./http.worker.ts", import.meta.url));
    w.postMessage({ type: "META", value: GIVEN_API.url });
    resolve(w);
  }
})

// Request counter for unique IDs
// XXX if need better atomics const ta = new Uint8Array(new SharedArrayBuffer(1));
var counter = 0;
export const workingset = new Set();

// Helper function to handle worker communication
const createWorkerRequest = async (
  type: string,
  endpoint: Route,
  data?: unknown,
): Promise<unknown> => {
  const worker = await workerPromise;
  return new Promise((resolve, reject) => {
    const id = counter++;
    workingset.add(id);

    const handler = (e: MessageEvent) => {
      const response = e.data;
      if (response.id === id) {
        worker.removeEventListener("message", handler);
        if (response.success) {
          resolve(response.data);
        } else {
          const error = new Error(response.error);
          toast.error(error.message);
          reject(error);
        }
      }
      workingset.delete(id);
    };

    worker.addEventListener("message", handler);
    worker.postMessage({ id, type, endpoint, data });
  });
};

// Modified API request functions
export const doAPIGetRequest = (
  endpoint: Route,
  queryObj?: { [key: string]: unknown },
): Promise<unknown> => {
  return createWorkerRequest("GET", endpoint, queryObj);
};

export const doAPIPostRequest = (
  endpoint: Route,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest("POST", endpoint, bodyObj);
};

export const doAPIDeleteRequest = (
  endpoint: Route,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest("DELETE", endpoint, bodyObj);
};

export const doAPIPutRequest = (
  endpoint: Route,
  bodyObj?: unknown,
): Promise<unknown> => {
  return createWorkerRequest("PUT", endpoint, bodyObj);
};
