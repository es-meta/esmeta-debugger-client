import { motion, AnimatePresence } from "motion/react"

import { CheckIcon, BanIcon, Loader2Icon, TriangleAlertIcon } from "lucide-react";

const parsingState = {
  'astReady'     : <div className="uppercase text-xs font-700 flex flex-row gap-1 justify-start items-center text-green-600"><CheckIcon /><span>AST&nbsp;Ready</span></div>,
  'loading'    : <div className="uppercase text-xs font-700 flex flex-row gap-1 justify-start items-center text-neutral-700"><span className="animate-spin"><Loader2Icon /></span><span>Parsing</span></div>,
  'syntaxError' : <div className="uppercase text-xs font-700 flex flex-row gap-1 justify-start items-center text-yellow-600"><TriangleAlertIcon /><span>Syntax&nbsp;Error</span></div>,
  'error'       : <div className="uppercase text-xs font-700 flex flex-row gap-1 justify-start items-center text-red-600"><BanIcon /><span>Error</span></div>,
} as const;

interface Props {
  state: keyof typeof parsingState;
}

const StateTransition = ({ state } : Props ) => {

  const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
  };

  return (
    <div className="relative w-full h-full">
      <div className="relative min-h-full">&nbsp;</div>
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          className="absolute size-fit -translate-y-full top-0"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            // bounce: 0,
            duration: 0.1,
          }}
        >
          {parsingState[state]}
        </motion.div>
      </AnimatePresence>
      </div>
  );
};

export default StateTransition;