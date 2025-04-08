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
      readonly type: "browser";
    }
  | {
      readonly type: "http";
      readonly url: string;
      readonly error: boolean;
      readonly rawUrl: string | null;
    } = (() => {
  // should allow empty string
  let api = getSearchQuery(QUERY_API);

  if (api === null) {
    api = getLocalStorage(QUERY_API);
  }
    
    const genBrowserApi = () => ({ type: "browser" } as const);
    const getHttpApi = () => {
      try {
        logger.warn(api);
        return {
          type: "http",
          url: api || FALLBACK_API_URl,
          error: false,
          rawUrl: api,
        } as const;
      } catch {
        logger.error(
          `Invalid API URL: ${api}. Using fallback URL: ${FALLBACK_API_URl}`,
        );
        return { type: "http", url: FALLBACK_API_URl, error: true, rawUrl: api } as const;
      }
    };

    const defaultApi = getHttpApi;

  if (api === null) return defaultApi();
  if (api === "browser") {
    return genBrowserApi();
  } else  {
    return getHttpApi();
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
