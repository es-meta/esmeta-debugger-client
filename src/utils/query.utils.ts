import { logger } from "./logger.utils";

export function getSearchQuery(name: string): string | null {
  const x = new URLSearchParams(location.search).get(name);
  logger.log?.("[PREPARING]", "getSearchQuery", "got", x, "for", name);
  if (x === null) return null;
  return x; //decodeURIComponent(x);
}

export function buildSearchParams(name: string, value: string | null): string {
  const search = new URLSearchParams(location.search);
  if (value === null) {
    search.delete(name);
  } else {
    search.set(name, value);
  }
  return `?${search.toString()}`;
}

// TODO - use localstorage with cookie alert

// const PREFIX = "esmeta_";

// function withPrefix(prefix: string, name: string): string {
//   return `${prefix}${name}`;
// }

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setLocalStorage(name: string, value: string): boolean {
  return false;
  // if (!window.localStorage) return false;
  // try {
  //   window.localStorage.setItem(withPrefix(PREFIX, name), value);
  //   return true;
  // } catch {
  //   return false;
  // }
}

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getLocalStorage(name: string): string | null {
  return null;
  // if (IS_PRERENDERING) return null;
  // const x = localStorage.getItem(withPrefix(PREFIX, name));
  // if (x === null) return null;
  // return x;
}
