import { motion, AnimatePresence } from "motion/react";

import {
  CheckIcon,
  BanIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  CircleCheckBigIcon,
  LoaderPinwheelIcon,
  CircleAlertIcon,
} from "lucide-react";

const connectState = {
  init: (
    <div className="flex  flex-row gap-1 items-center text-yellow-500 rounded-lg text-xs uppercase font-800">
      <span>
        <Loader2Icon className="animate-spin" />
      </span>
      Initalzing…
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
      Not Connected
    </div>
  ),
} as const;

interface Props {
  state: keyof typeof connectState;
}

const ConnectStateViewer = ({ state }: Props) => {
  const variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <div className="relative w-full h-full">
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
};

export default ConnectStateViewer;
