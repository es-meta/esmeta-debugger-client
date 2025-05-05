import { USE_VERBOSE_LOG } from "@/constants";
import { toast } from "react-toastify";

type LoggerTypeBasic = {
  info: (...data: unknown[]) => void;
  log: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
};

type LoggerTypeWithToast = {
  withToast: LoggerTypeBasic;
} & Partial<LoggerTypeBasic>;

const withToast = Object.freeze({
  info: (...data: unknown[]) => {
    toast.info(data.map(d => String(d)).join("\n"));
    if (USE_VERBOSE_LOG) console.info(...data);
  },
  log: (...data: unknown[]) => {
    toast.done(data.map(d => String(d)).join("\n"));
    if (USE_VERBOSE_LOG) console.log(...data);
  },
  error: (...data: unknown[]) => {
    toast.error(data.map(d => String(d)).join("\n"));
    if (USE_VERBOSE_LOG) console.error(...data);
  },
  warn: (...data: unknown[]) => {
    toast.warn(data.map(d => String(d)).join("\n"));
    if (USE_VERBOSE_LOG) console.warn(...data);
  },
});

export const logger: LoggerTypeWithToast = Object.freeze(
  USE_VERBOSE_LOG
    ? {
        withToast,
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
      }
    : { withToast },
);
