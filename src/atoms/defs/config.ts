/////// programs ///////
import { SEARCHPARAM_NAME_ITER, SEARCHPARAM_NAME_API } from "@/constants";
import {
  logger,
  buildSearchParams,
  getLocalStorage,
  getSearchQuery,
} from "@/utils";
import { atom } from "jotai";

const FALLBACK_API_URl = "http://localhost:8080";

const givenOriginAtom = atom(
  (): { type: "visualizer"; iter: number } | { type: "none"; iter: null } => {
    const iter = Number(getSearchQuery(SEARCHPARAM_NAME_ITER) || undefined);

    if (Number.isNaN(iter)) {
      return { type: "none", iter: null };
    } else {
      return { type: "visualizer", iter };
    }
  },
);

const givenApiAtom = atom(
  ():
    | {
        readonly type: "browser";
      }
    | {
        readonly type: "http";
        readonly url: string;
        readonly error: boolean;
        readonly rawUrl: string | null;
      } => {
    // should allow empty string
    let api = getSearchQuery(SEARCHPARAM_NAME_API);

    if (api === null) {
      api = getLocalStorage(SEARCHPARAM_NAME_API);
    }

    const genBrowserApi = () => ({ type: "browser" }) as const;
    const genHttpApi = () => {
      try {
        logger.warn?.(api);
        return {
          type: "http",
          url: api || FALLBACK_API_URl,
          error: false,
          rawUrl: api,
        } as const;
      } catch {
        logger.error?.(
          `Invalid API URL: ${api}. Using fallback URL: ${FALLBACK_API_URl}`,
        );
        return {
          type: "http",
          url: FALLBACK_API_URl,
          error: true,
          rawUrl: api,
        } as const;
      }
    };

    const defaultApi = genHttpApi;

    if (api === null) return defaultApi();
    if (api === "browser") {
      return genBrowserApi();
    } else {
      return genHttpApi();
    }
  },
);

export const setApiAtom = atom(null, (get, set, update: string) => {
  // TODO no refresh
  window.location.search = buildSearchParams(SEARCHPARAM_NAME_API, update);
});

export const givenConfigAtom = atom(get => {
  return {
    origin: get(givenOriginAtom),
    api: get(givenApiAtom),
  };
});
