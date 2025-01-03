import { motion, AnimatePresence } from "motion/react";
import { Loader2Icon } from "lucide-react";
import {
  CircleCheckBigIcon,
  LoaderPinwheelIcon,
  CircleAlertIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";

const connectState = {
  init: (
    <div className="flex  flex-row gap-1 items-center text-yellow-500 rounded-lg text-xs uppercase font-800">
      <span>
        <Loader2Icon className="animate-spin" />
      </span>
      Connecting
    </div>
  ),
  connected: (
    <div className="flex  flex-row gap-1 items-center text-green-500 rounded-lg text-xs font-800">
      <CircleCheckBigIcon size={18} />
      Connected
    </div>
  ),
  busy: (
    <div className="flex  flex-row gap-1 items-center text-blue-500 rounded-lg text-xs font-800">
      <LoaderPinwheelIcon size={18} className="animate-spin" />
      Busy
    </div>
  ),
  not_connected: (
    <div className="flex  flex-row gap-1 items-center text-red-500 rounded-lg text-xs font-800">
      <CircleAlertIcon size={18} />
      Lost
    </div>
  ),
} as const;

function matchAppstate(st: ReduxState) {
  const x = st.appState.busy;
  const isInit = st.appState.state === AppState.INIT;
  if (x === 0) {
    return "connected";
  }
  if (x > 0) {
    return isInit ? "init" : "busy";
  }
  return "not_connected";
}

export default function ConnectStateViewer() {
  const state = useSelector(matchAppstate);

  const variants = useMemo(
    () => ({
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 8 },
    }),
    [],
  );

  return (
    <div className="relative w-28 h-4">
      <div className="relative min-h-full max-h-full">&nbsp;</div>
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          className="absolute top-1/2 left-2 *:-translate-y-1/2"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            // bounce: 0,
            duration: 0.0625,
          }}
        >
          {connectState[state]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
