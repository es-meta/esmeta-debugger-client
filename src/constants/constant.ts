export const HOMEPAGE_LINK_ESMETA = "https://es-meta.github.io";
export const GITHUB_LINK_ESMETA = "https://github.com/es-meta/esmeta";
export const GITHUB_LINK_ESMETA_DEBUGGER =
  "https://github.com/es-meta/esmeta-debugger-client";

export const IS_DEBUG = process.env.NODE_ENV === "development";

// NOTE please also update package.json
export const CLIENT_VERSION = "0.1.0";

// TODO use api to have fine grained control over the spec version
export const SPEC_URL = "https://tc39.es/ecma262/2024/";

// TODO refactor? maybe too specific?
export const EXECUTION_STACK_ADDR = "#EXECUTION_STACK";

export const USE_VERBOSE_LOG = false;

type LoggerType = {
  log: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
};

export const logger: LoggerType = USE_VERBOSE_LOG
  ? Object.freeze({
      log: (...data: unknown[]): void => {
        console.log(...data);
      },

      error: (...data: unknown[]): void => {
        console.error(...data);
      },

      warn: (...data: unknown[]): void => {
        console.warn(...data);
      },
    } satisfies LoggerType)
  : Object.freeze({
      log: () => {},
      error: () => {},
      warn: () => {},
    } satisfies LoggerType);
