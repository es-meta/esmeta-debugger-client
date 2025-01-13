import { motion } from "motion/react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, RefObject, useState } from "react";

export default function WelcomeModal() {
  let [isOpen, setIsOpen] = useState(true);

  const [idx, setIdx] = useState(0);

  const modal = useRef(null);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  {/* <DialogTitle
                              as="h3"
                              className="text-xl font-700 leading-6 text-gray-900"
                            >
                              ESMeta Debugger Settings
                            </DialogTitle> */}
                  <div
                    ref={modal}
                    className="relative w-full h-[32rem] overflow-y-scroll "
                  >
                    <Funnel1 show={idx === 0} />
                    <Funnel2 show={idx === 1} />
                    <Funnel3 show={idx === 2} />
                    <Funnel4 show={idx === 3} />
                    <div className="fixed bottom-0 right-0 flex flex-row m-4 gap-2 touch-none">
                      <button onClick={() => setIsOpen(false)}>dive now</button>
                      {idx < 4 - 1 && (
                        <button
                          onClick={() => {
                            setIdx(idx + 1);
                          }}
                        >
                          <ArrowRightIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

////////////////////////////////////////////////////////

import  { useEffect, useRef } from "react";
import {
  useTransform,
  useScroll,
} from "motion/react";
import { useInView } from "react-intersection-observer";

import { Funnel1, Funnel2, Funnel3, Funnel4 } from "./funnels";
import { ArrowRightIcon } from "lucide-react";

interface WelcomeScreenProps {
  modalRef: RefObject<HTMLDivElement>;
  close: () => void;
}

function WelcomeScreen({ modalRef, close }: WelcomeScreenProps) {
  const { scrollY } = useScroll({
    container: modalRef,
  });
  // const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  // const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 0.5,
    triggerOnce: false,
  });

  console.log(entry);

  const [isInViewport, setIsInViewport] = useState(false);

  console.log(window.innerHeight);
  let coso = useRef(null);

  const height = 512;

  const y1 = useTransform(scrollY, [0, height], [0, height / 1.5]); // Y 축 이동
  const opacity1 = useTransform(scrollY, [0, height / 2], [1, 0]); // 투명도 변환
  const scale1 = useTransform(scrollY, [0, height], [1, 0.8]); // 크기 변화

  const y2 = useTransform(
    scrollY,
    [0, height * 1, height * 2],
    [-height / 1.5, 0, height / 1.5],
  ); // Y 축 이동
  const opacity2 = useTransform(
    scrollY,
    [0, height * 1, height * 2],
    [0, 1, 0],
  ); // 투명도 변환
  const scale2 = useTransform(
    scrollY,
    [0, height * 1, height * 2],
    [0.8, 1, 0.8],
  ); // 크기 변화

  const y3 = useTransform(
    scrollY,
    [height * 1, height * 2, height * 3],
    [-height / 1.5, 0, height / 1.5],
  ); // Y 축 이동
  const opacity3 = useTransform(
    scrollY,
    [height * 1, height * 2, height * 3],
    [0, 1, 0],
  ); // 투명도 변환
  const scale3 = useTransform(
    scrollY,
    [height * 1, height * 2, height * 3],
    [0.8, 1, 0.8],
  ); // 크기 변화

  const y4 = useTransform(
    scrollY,
    [height * 2, height * 3, height * 4],
    [-height / 1.5, 0, height / 1.5],
  ); // Y 축 이동
  const opacity4 = useTransform(
    scrollY,
    [height * 2, height * 3, height * 4],
    [0, 1, 0],
  ); // 투명도 변환
  const scale4 = useTransform(
    scrollY,
    [height * 2, height * 3, height * 4],
    [0.8, 1, 0.8],
  ); // 크기 변화

  useEffect(() => {
    console.log(scrollY.get());
  }, [scrollY]);

  return (
    <>
      <motion.div
        className="size-full flex flex-col items-center justify-center gap-4 p-4"
        style={{
          y: y1,
          // transform: `translateY(}px)`,
          opacity: opacity1,
          scale: scale1,
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
          enabling you to step through the ECMAScript specification line by
          line.
        </p>

        {/* TODO */}
        {/* <motion.div
          animate={inView ? "visible" : "hidden"}
          initial
          variants={variants}
          transition={{ duration: 2, ease: "easeOut" }}
          ref={ref}
          className="magic absolute"
        /> */}
      </motion.div>
      {/* <motion.div
        style={{
          y,
          opacity,
          scale,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 w-32 h-32 rounded-full shadow-lg"
      />
      <motion.div className="box absolute" style={{ y: y1, x: -50 }} />
      <motion.div
        className="box absolute"
        style={{ y: y2, x: 50, background: "salmon" }}
      /> */}
      <motion.div
        className="text-lg text-center size-full flex flex-col items-center justify-center p-4"
        style={{
          y: y2,
          opacity: opacity2,
          scale: scale2,
        }}
      >
        To get started, simply enter your code into the editor. You can then run
        the program and use the controls at the top of the screen to step
        through the code while observing the interpreter state in detail.
      </motion.div>
      <motion.div
        className="text-lg text-center size-full flex flex-col items-center justify-center p-4"
        style={{
          y: y3,
          opacity: opacity3,
          scale: scale3,
        }}
      >
        This debugger is powered by ESMeta, a meta-level ECMAScript toolchain
        built on a mechanized specification. In other words, ESMeta is a
        “spec-compiler,” converting the ECMAScript specification (ECMA-262) into
        executable code.
      </motion.div>
      <motion.div
        className="text-lg text-center size-full flex flex-col items-center justify-center p-4"
        style={{
          y: y4,
          opacity: opacity4,
          scale: scale4,
        }}
      >
        Double Debugging is just one of the many abilities offered by ESMeta.
        For more information, visit our GitHub repository.
      </motion.div>
      {/* <div style={{ position: "fixed", top: 0, left: 0 }}>
        {" "}
        {"is in view? " + inView}
        {scrollY.get()}
        height: {height}
      </div> */}
    </>
  );
}

// const Button = tw.button`
//   bg-es-400 hover:bg-es-700 text-white px-4 py-2 rounded-lg active:scale-90 transition-all
// `;
