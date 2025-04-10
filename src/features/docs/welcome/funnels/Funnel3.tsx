import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

export default function Funnel3({ show }: { show: boolean }) {
  // const [ref, inView] = useInView({
  //   /* Optional options */
  //   threshold: 0.5,
  //   triggerOnce: false,
  // });

  return (
    <motion.div
      initial={false}
      exit={{ opacity: 0, scale: 0.65, y: -50 }}
      // ref={ref}
      className="size-full flex flex-col items-center justify-center gap-4 p-4 absolute"
      animate={show ? "visible" : "hidden"}
      transition={{ duration: 0.25, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, scale: 1, y: 0 },
        hidden: {
          opacity: 0,
          scale: 0.65,
          y: 50,
        },
      }}
    >
      <p className="text-lg text-center">
        This debugger is powered by ESMeta, a meta-level ECMAScript toolchain
        built on a mechanized specification. In other words, ESMeta is a
        “spec-compiler,” converting the ECMAScript specification (ECMA-262) into
        executable code.
      </p>
    </motion.div>
  );
}
