import { toast } from "react-toastify";
import { Route } from "./route.type";

// Create worker instance
const worker = new Worker(new URL('./api.worker.ts', import.meta.url));

// Request counter for unique IDs
const ta = new Uint8Array(new SharedArrayBuffer(1));

// Helper function to handle worker communication
const createWorkerRequest = (type: string, endpoint: Route, data?: unknown): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const id = Atomics.add(ta, 0, 1);
    
    const handler = (e: MessageEvent) => {
      const response = e.data;
      if (response.id === id) {
        worker.removeEventListener('message', handler);
        if (response.success) {
          resolve(response.data);
        } else {
          const error = new Error(response.error);
          toast.error(error.message);
          reject(error);
        }
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ id, type, endpoint, data });
  });
};

// Modified API request functions
export const doAPIGetRequest = (
  endpoint: Route,
  queryObj?: { [key: string]: unknown }
): Promise<unknown> => {
  return createWorkerRequest('GET', endpoint, queryObj);
};

export const doAPIPostRequest = (
  endpoint: Route,
  bodyObj?: unknown
): Promise<unknown> => {
  return createWorkerRequest('POST', endpoint, bodyObj);
};

export const doAPIDeleteRequest = (
  endpoint: Route,
  bodyObj?: unknown
): Promise<unknown> => {
  return createWorkerRequest('DELETE', endpoint, bodyObj);
};

export const doAPIPutRequest = (
  endpoint: Route,
  bodyObj?: unknown
): Promise<unknown> => {
  return createWorkerRequest('PUT', endpoint, bodyObj);
};