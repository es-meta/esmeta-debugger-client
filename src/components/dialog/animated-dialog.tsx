import { Fragment, Suspense, useCallback, useMemo, useState } from "react";
import { cn } from "@/utils";
// import { lazy } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { SuspenseBoundary } from "@/components/primitives/suspense-boundary";

// disable lazy loading for now
import * as LazyComps from "./animated-dialog.lazy";

// const LazyComps = {
//   Dialog: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({ default: m.Dialog })),
//   ),
//   DialogBackdrop: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({ default: m.DialogBackdrop })),
//   ),
//   DialogPanel: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({ default: m.DialogPanel })),
//   ),
//   DialogTitle: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({ default: m.DialogTitle })),
//   ),
//   Transition: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({ default: m.Transition })),
//   ),
//   TransitionChild: lazy(() =>
//     import("./animated-dialog.lazy").then(m => ({
//       default: m.TransitionChild,
//     })),
//   ),
// };

interface Props {
  initialOpen?: boolean;
  className?: string;
  buttonContent: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  onPreload?: () => void;
  onClose?: (value: boolean) => void;
}

export function AnimatedDialog({
  initialOpen = false,
  buttonContent,
  className,
  children,
  title,
  onPreload,
  onClose,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isOpenEverOnce, setIsOpenEverOnce] = useState(isOpen);

  // TODO fix, not working
  const animationPropsBg = useMemo(
    () =>
      shouldReduceMotion
        ? {}
        : {
            enter: "ease-out duration-50",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-100",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
          },
    [shouldReduceMotion],
  );

  const animationPropsContent = useMemo(
    () =>
      shouldReduceMotion
        ? {}
        : {
            enter: "ease-out duration-100",
            enterFrom: "opacity-0 scale-95",
            enterTo: "opacity-100 scale-100",
            leave: "ease-in duration-100",
            leaveFrom: "opacity-100 scale-100",
            leaveTo: "opacity-0 scale-95",
          },
    [shouldReduceMotion],
  );

  const handleMouseEnter = useCallback(() => {
    import("./animated-dialog.lazy").then(() => {
      if (onPreload) {
        onPreload();
      }
    });
  }, [onPreload]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) {
      setTimeout(() => onClose(false), 100);
    }
  }, [onClose]);

  const openModal = useCallback(() => {
    setIsOpenEverOnce(true);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.target instanceof HTMLElement) {
        const closeButton = e.target.closest('[data-dialog-control="close"]');
        if (closeButton) {
          handleClose();
        }
      }
    },
    [handleClose],
  );

  return (
    <>
      <button onMouseEnter={handleMouseEnter} onClick={openModal}>
        {buttonContent}
      </button>
      {isOpenEverOnce && (
        <Suspense fallback={null}>
          <LazyComps.Transition appear show={isOpen} as={Fragment}>
            <LazyComps.Dialog
              as="div"
              className="relative z-20"
              onClose={handleClose}
            >
              <LazyComps.TransitionChild as={Fragment} {...animationPropsBg}>
                <LazyComps.DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-md" />
              </LazyComps.TransitionChild>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <LazyComps.TransitionChild
                    as={Fragment}
                    {...animationPropsContent}
                  >
                    <LazyComps.DialogPanel
                      className={cn(
                        "relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 text-left align-middle transition-all space-y-4",
                        className,
                      )}
                      onClick={closeModal}
                    >
                      {title && (
                        <LazyComps.DialogTitle
                          as="h3"
                          className="text-xl font-700 leading-6"
                        >
                          {title}
                        </LazyComps.DialogTitle>
                      )}

                      <SuspenseBoundary
                        unexpected
                        error={
                          <div className="w-full flex justify-center items-center h-32 p-8">
                            <div className="text-neutral-500 dark:text-neutral-400">
                              Error loading content
                            </div>
                          </div>
                        }
                        loading={
                          <div className="w-full flex justify-center items-center h-32 p-8">
                            <LoaderCircleIcon className="w-6 h-6 animate-spin text-neutral-500 dark:text-neutral-400" />
                          </div>
                        }
                      >
                        {children}
                      </SuspenseBoundary>
                    </LazyComps.DialogPanel>
                  </LazyComps.TransitionChild>
                </div>
              </div>
            </LazyComps.Dialog>
          </LazyComps.Transition>
        </Suspense>
      )}
    </>
  );
}
