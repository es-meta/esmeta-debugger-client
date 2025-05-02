import { USE_VERBOSE_LOG } from "@/constants";

type LoggerType = {
  info: (...data: unknown[]) => void;
  log: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
};

function empty(): void {}

export const logger: LoggerType = Object.freeze(
  USE_VERBOSE_LOG
    ? {
        info: console.info,
        log: console.log,
        error: console.error,
        warn: console.warn,
      }
    : {
        info: empty,
        log: empty,
        error: empty,
        warn: empty,
      },
);
