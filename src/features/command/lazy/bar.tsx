import { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "jotai";
import type { Command } from "./types";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";
import CommandBarCombobox from "./combobox";

function isCommandBarTriggered(event: KeyboardEvent) {
  return event.key === ":"; // && (event.metaKey || event.ctrlKey);
}

export default function CommandBar() {
  const store = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isCommandBarTriggered(event)) {
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
        if (action.type === "func") {
          action.func();
        } else if (action.type === "atom") {
          store.set(action.atom);
        }
      }
      setIsVisible(false);
      toast.info("command bar called " + command.label);
    },
    [store],
  );

  const handleBackspace = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className="flex-col fixed top-0 touch-none left-0 w-full h-full bg-gradient-to-b from-black/0 to-black/25 flex items-center justify-start z-50"
          onClick={() => setIsVisible(false)}
          initial={variantsBg.initial}
          animate={variantsBg.animate}
          exit={variantsBg.exit}
          transition={{ duration: 0.125 }}
        >
          <motion.div
            className="absolute left-4 right-4 bottom-4"
            onClick={e => e.stopPropagation()}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.125 }}
          >
            <CommandBarCombobox
              ref={inputRef}
              value={null}
              setValue={handleCommand}
              close={handleBackspace}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const variantsBg = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
