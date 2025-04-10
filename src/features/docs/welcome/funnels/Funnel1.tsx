import { motion } from "motion/react";

export default function Funnel1({ show }: { show: boolean }) {
  // const [ref, inView] = useInView({
  //   /* Optional options */
  //   threshold: 0.5,
  //   triggerOnce: false,
  // });

  return (
    <motion.div
      // ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 100 }}
      exit={{ opacity: 0, scale: 0.95, y: -100 }}
      className="size-full flex flex-col items-center justify-center gap-4 p-4 absolute"
      animate={show ? "visible" : "hidden"}
      transition={{ duration: 1, times: [0, 0.5, 1], ease: [0.2, 0.8, 0.4, 1] }}
      variants={{
        visible: { opacity: [0, 1, 1, 1], y: 0, scale: 1 },
        hidden: { opacity: [1, 0, 0, 0], y: -100, scale: 0.95 },
      }}
    >
      <motion.img
        src="/icon.jpeg"
        alt="ESMeta Logo"
        className="w-20 h-20 mx-auto"
        // style={{y: y1_1}}
      />
      <h1 className="text-4xl font-700">Welcome to ESMeta Double Debugger</h1>

      <p className="text-lg text-center">
        The ESMeta Double Debugger is a tool that displays both the
        ECMAScript/JavaScript program state and the ES/JS interpreter state,
        enabling you to step through the ECMAScript specification line by line.
      </p>
    </motion.div>
  );
}
