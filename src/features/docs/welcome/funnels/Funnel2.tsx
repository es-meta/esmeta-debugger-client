import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

export default function Funnel2({ show }: { show: boolean }) {
  // const [ref, inView] = useInView({
  //   /* Optional options */
  //   threshold: 0.5,
  //   triggerOnce: false,
  // });

  return (
    <>
      <motion.pre
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={show ? "visible" : "hidden"}
        exit={{ opacity: 0, scale: 1, y: -25 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.25 }}
        variants={{
          visible: { opacity: [0, 1, 1, 1], y: 0, scale: 1 },
          hidden: { opacity: [1, 0, 0, 0], y: -100, scale: 0.95 },
        }}
      >
        const x = 42;
      </motion.pre>
      <motion.div
        initial={false}
        exit={{ opacity: 0, scale: 1, y: -50 }}
        // ref={ref}
        className="size-full flex flex-col items-center justify-center gap-4 p-4 absolute"
        transition={{ duration: 0.25, ease: "easeOut" }}
        animate={show ? "visible" : "hidden"}
        // transition={{ duration: 0.25, ease: 'easeOut', delay: 0.25 }}
        variants={{
          visible: { opacity: [0, 1, 1, 1], y: 0, scale: 1 },
          hidden: { opacity: [1, 0, 0, 0], y: -100, scale: 0.95 },
        }}
      >
        <p className="text-lg text-center">
          To get started, simply enter your code into the editor. You can then
          run the program and use the controls at the top of the screen to step
          through the code while observing the interpreter state in detail.
        </p>
      </motion.div>
    </>
  );
}
