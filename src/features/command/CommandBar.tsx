import { useState, useEffect, useRef, useCallback, lazy } from "react";
import { useStore } from "jotai";
import type { Command } from "./command.types";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks";

const CommandBarCombobox = lazy(() => import("./CommandBarCombobox"));

export default function CommandBar() {
  const store = useStore();
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setIsVisible(true);
      inputRef.current?.focus();
    } else if (event.key === "Escape") {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommand = useCallback(
    (command: Command | null) => {
      if (command === null) return;
      const { target: action } = command;
      if (action) {
        if (action.type === "redux") dispatch(action);
        else store.set(action.atom);
      }
      setIsVisible(false);
      toast.info("command bar called " + command.label);
    },
    [dispatch, store],
  );

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className="flex-col fixed top-0 touch-none left-0 w-full h-full bg-black/25 backdrop-blur-md flex items-center justify-start z-50"
          onClick={() => setIsVisible(false)}
          initial={variantsBg.initial}
          animate={variantsBg.animate}
          exit={variantsBg.exit}
        >
          <motion.div
            className="relative mt-16 w-1/2"
            onClick={e => e.stopPropagation()}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
          >
            <CommandBarCombobox
              ref={inputRef}
              value={null}
              setValue={handleCommand}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const variantsBg = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
