import { motion } from "motion/react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, Ref, RefObject, useState } from "react";
import ConnectStateViewer from "@/features/modal/connection/ConnectStateViewer";

export default function WelcomeModal() {
  let [isOpen, setIsOpen] = useState(true);

  const modal = useRef(null);

  function openModal() {
    setIsOpen(true);
  }

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
            <div
              
              className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}

                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* <DialogTitle
                              as="h3"
                              className="text-xl font-700 leading-6 text-gray-900"
                            >
                              ESMeta Debugger Settings
                            </DialogTitle> */}
                  <div ref={modal}  className="relative w-full h-[32rem] overflow-y-scroll">
                    <WelcomeScreen modalRef={modal} />
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


import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  useViewportScroll,
  useTransform,
  useMotionValue,
  useScroll
} from 'motion/react';
import { useInView } from 'react-intersection-observer';

import './styles.css';

function WelcomeScreen({modalRef} : { modalRef: RefObject<HTMLElement> }) {
  const { scrollY } = useScroll({
    container: modalRef,
  });
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 0.5,
    triggerOnce: false
  });

  console.log(entry);

  const [isInViewport, setIsInViewport] = useState(false);

  console.log(window.innerHeight);
  let coso = useRef(null);

  const y = useTransform(scrollY, [0, 500], [0, 200]); // Y 축 이동
  const opacity = useTransform(scrollY, [100, 400], [1, 0]); // 투명도 변환
  const scale = useTransform(scrollY, [0, 500], [1, 0.5]); // 크기 변화

  useEffect(() => {
    console.log(scrollY.get())
  }, [scrollY]);

  const variants = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: {
      opacity: 0,
      scale: 0.65,
      y: 50
    }
  };

  return (
    <>
      <div className="snap-start size-full">
        <img src="/icon.jpeg" alt="ESMeta Logo" className="w-20 h-20 mx-auto" />
        <h1 className="text-4xl font-700">Welcome to ESMeta Double Debugger</h1>

        <p className="text-lg text-center">
        The ESMeta Double Debugger is a tool that displays both the
        ECMAScript/JavaScript program state and the ES/JS interpreter state,
        enabling you to step through the ECMAScript specification line by line.
        </p>
        <button onClick={() => console.log('skip')}>
          skip
        </button>
        <button>
          next
        </button>
        {/* TODO */}
        {/* <motion.div
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        transition={{ duration: 2, ease: 'easeOut' }}
        ref={ref}
        className="magic absolute"
        /> */}

      </div>
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
        style={{ y: y2, x: 50, background: 'salmon' }}
      /> */}
      <p className="snap-start text-lg text-center size-full">
        To get started, simply enter your code into the editor. You can then run
        the program and use the controls at the top of the screen to step
        through the code while observing the interpreter state in detail.
      </p>
      <p className="snap-start text-lg text-center size-full">
        This debugger is powered by ESMeta, a meta-level ECMAScript toolchain
        built on a mechanized specification. In other words, ESMeta is a
        “spec-compiler,” converting the ECMAScript specification (ECMA-262) into
        executable code.
      </p>
      <p className="snap-start text-lg text-center size-full">
        Double Debugging is just one of the many abilities offered by ESMeta.
        For more information, visit our GitHub repository.
      </p>
      
      {/* <div style={{ height: 500 }} />
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        {' '}
        {'is in view? ' + inView}
      </div> */}
    </>
  );
}
