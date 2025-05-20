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
      className="size-full space-y-4 p-6 absolute text-left"
      animate={show ? "visible" : "hidden"}
      transition={{ duration: 1, times: [0, 0.5, 1], ease: [0.2, 0.8, 0.6, 1] }}
      variants={{
        visible: { opacity: [0, 1, 1, 1], y: 0, scale: 1 },
        hidden: { opacity: [1, 0.1, 0, 0], y: -100, scale: 0.95 },
      }}
    >
      <motion.img
        src={new URL("@resources/icon.jpeg", import.meta.url).href}
        alt="ESMeta Logo"
        className="relative w-32 h-32 rounded-lg mr-auto"
        // style={{y: y1_1}}
      />
      <div>
        <h1 className="text-2xl font-500">Welcome to </h1>
        <h1 className="text-4xl font-700">ESMeta Double&nbsp;Debugger</h1>
      </div>

      <p className="text-base/loose text-left">
        The ESMeta Double Debugger is a tool that displays both the JavaScript
        program state and the interpreter state, enabling you to{" "}
        <b>step through the ECMAScript specification line by line</b>.
      </p>
    </motion.div>
  );
}
