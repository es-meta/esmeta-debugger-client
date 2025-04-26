import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";

interface Props {
  buttonContent: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  onClose?: (value: boolean) => void;
}

export function AnimatedDialog({
  buttonContent: button,
  children,
  title,
  onClose,
}: Props) {
  let [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) {
      onClose(false);
    }
  }, [onClose]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.target instanceof HTMLElement) {
      const closeButton = e.target.closest('[data-dialog-control="close"]');
      if (closeButton) {
        console.log("모달 닫기!");
        setIsOpen(false);
      }
    }
  }, []);

  return (
    <>
      <button onClick={openModal}>{button}</button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all space-y-4"
                  onClick={closeModal}
                >
                  <DialogTitle as="h3" className="text-xl font-700 leading-6">
                    {title}
                  </DialogTitle>

                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
