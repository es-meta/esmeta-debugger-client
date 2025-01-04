/// <reference lib="webworker" />

// const API_HOST = "http://localhost:8080";

let API_HOST: string = "http://localhost:8080";

import type { HTTPMethod } from "./worker/schema.types";

// json header
const mkJSONHeader = (): Record<string, string> => {
  const headers: { [index: string]: string } = {};
  headers["Content-Type"] = "application/json";
  headers["Accept"] = "application/json";
  return headers;
};

// trim slash
const trim_slash = (input: string): string => {
  return input.replace(/\/+$/, "").replace(/^\/+/, "");
};

// make url for GET request
const mkURL = (
  host: string,
  endpoint: string,
  queryObj: { [key: string]: unknown } = {},
): string => {
  let url = `${trim_slash(host)}/${trim_slash(endpoint)}`;
  const listParams: string[] = [];
  for (const key in queryObj) {
    const entry = queryObj[key];
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      const param = `${encodeURIComponent(key)}=${encodeURIComponent(
        entry.toString(),
      )}`;
      listParams.push(param);
    } else if (entry !== undefined || entry !== null) {
      throw new Error(`Not supported entry type: ${typeof entry}(${entry})`);
    }
  }
  if (listParams.length > 0) {
    const querystring = listParams.join("&");
    url += `?${querystring}`;
  }
  return url;
};

// raw GET request
const doGetRequest = async (
  host: string,
  endpoint: string,
  queryObj?: { [key: string]: unknown },
): Promise<unknown> => {
  const url = mkURL(host, endpoint, queryObj);
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok)
    throw new Error(`GET request to ${url} failed with ${response.status}`);
  return await response.json();
};

// raw POST-like request
const doWriteRequest = async (
  host: string,
  method: HTTPMethod,
  endpoint: string,
  bodyObj?: unknown,
): Promise<unknown> => {
  const url = mkURL(host, endpoint);
  const response = await fetch(url, {
    method,
    headers: {
      ...(bodyObj ? mkJSONHeader() : undefined),
    },
    body: bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
  });
  if (!response.ok)
    throw new Error(
      `${method} request to ${url} failed with ${response.status}`,
    );
  return await response.json();
};

// Modify the request handlers to send responses back to the main thread
self.onmessage = async (e: MessageEvent) => {
  const { id, type, endpoint, data } = e.data;

  try {
    let result;
    switch (type) {
      case "META":
        API_HOST = data;
        result = API_HOST;
        break;
      case "GET":
        result = await doGetRequest(API_HOST, endpoint, data);
        break;
      case "POST":
        result = await doWriteRequest(API_HOST, "POST", endpoint, data);
        break;
      case "PUT":
        result = await doWriteRequest(API_HOST, "PUT", endpoint, data);
        break;
      case "DELETE":
        result = await doWriteRequest(API_HOST, "DELETE", endpoint, data);
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
