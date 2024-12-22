import { motion, AnimatePresence } from "motion/react";

import {
  CheckIcon,
  BanIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react";

const parsingState = {
  astReady: (
    <div className="uppercase top-1/2 -translate-y-1 text-xs font-700 flex flex-row gap-1 justify-start items-center text-green-600">
      <CheckIcon />
      <span>AST&nbsp;Ready</span>
    </div>
  ),
  loading: (
    <div className="uppercase top-1/2 -translate-y-1 text-xs font-700 flex flex-row gap-1 justify-start items-center text-neutral-700">
      <span className="animate-spin">
        <Loader2Icon />
      </span>
      <span>Parsing</span>
    </div>
  ),
  syntaxError: (
    <div className="uppercase top-1/2 -translate-y-1 text-xs font-700 flex flex-row gap-1 justify-start items-center text-yellow-600">
      <TriangleAlertIcon />
      <span>Syntax&nbsp;Error</span>
    </div>
  ),
  error: (
    <div className="uppercase top-1/2 -translate-y-1 text-xs font-700 flex flex-row gap-1 justify-start items-center text-red-600">
      <BanIcon />
      <span>Error</span>
    </div>
  ),
} as const;

interface Props {
  state: keyof typeof parsingState;
}

const StateTransition = ({ state }: Props) => {
  const variants = {
    initial: { opacity: 0, y: 16, scale: 0.5 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.5 },
  };

  return (
    <div className="relative w-32 h-8">
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          className="absolute size-fit top-0"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            // bounce: 0,
            duration: 0.125,
          }}
        >
          {parsingState[state]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StateTransition;
