import React, { useState, useEffect, useRef, useCallback } from "react";
import CommandBarCombobox from "./CommandBarCombobox";
import type { Command } from "./command.type";

export default function CommandBar() {
  const dispatch = useDispatch<Dispatch>();
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      // event.preventDefault();
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

  const handleCommand = useCallback((command: Command | null) => {
    if (command === null) return;
    command.actions.forEach(dispatch);
    setIsVisible(false);
    toast.info('command bar called ' + command.label);
  }, [dispatch]);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className="flex-col fixed top-0 touch-none left-0 w-full h-full bg-black bg-opacity-5 flex items-center justify-start z-50"
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

import { AnimatePresence, motion } from "motion/react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@/store";
import { toast } from "react-toastify";

const variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const variantsBg = {
  initial: { opacity: 0,  },
  animate: { opacity: 1, },
  exit: { opacity: 0, },
};
