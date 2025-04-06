/////// programs ///////
import { getLocalStorage, getSearchQuery } from "@/util/query.util";
import { logger } from "./constant";

const QUERY_PROG = "prog";
const FALLBACK_CODE = `var x = 1;
var y = 2;
var z = x + y;
var w = z + x;

function f () {
  let a = 42;
  g(a);
  return 0;
}

function g(a) {
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
}

f();`;

const GIVEN_CODE = getSearchQuery(QUERY_PROG) || FALLBACK_CODE;

/////// api endpoint ///////
export const QUERY_API = "api";
const FALLBACK_API_URl = "http://localhost:8080";
const GIVEN_API:
  | {
      type: "browser";
    }
  | {
      type: "http";
      url: string;
      error: boolean;
      rawUrl: string | null;
    } = (() => {
  // should allow empty string
  let api = getSearchQuery(QUERY_API);

  if (api === null) {
    api = getLocalStorage(QUERY_API);
  }

  if (api === "browser") {
    return { type: "browser" };
  } else {
    try {
      logger.warn(api);
      if (api === null) throw new Error("API URL is not set");
      new URL(api);
      return {
        type: "http",
        url: api || FALLBACK_API_URl,
        error: false,
        rawUrl: api,
      };
    } catch {
      logger.error(
        `Invalid API URL: ${api}. Using fallback URL: ${FALLBACK_API_URl}`,
      );
      return { type: "http", url: FALLBACK_API_URl, error: true, rawUrl: api };
    }
  }
})();

/////// given origin ///////
const GIVEN_ORIGIN:
  | { type: "visualizer"; iter: number }
  | { type: "none"; iter: null } = (() => {
  const iter = Number(getSearchQuery("iter") || undefined);

  if (Number.isNaN(iter)) {
    return { type: "none", iter: null };
  } else {
    return { type: "visualizer", iter };
  }
})();

// TODO use appstate
/////// settings ///////
export const GIVEN_SETTINGS = Object.freeze({
  code: GIVEN_CODE,
  origin: GIVEN_ORIGIN,
  api: GIVEN_API,
});
