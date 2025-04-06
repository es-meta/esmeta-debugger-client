import { useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/ReactToastify.css";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/debugger-app/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import CommandBar from "./features/command/CommandBar";

export default function App() {
  useAppInitializer();

  return (
    <>
      <TooltipProvider delayDuration={0} skipDelayDuration={10000}>
        <div className="max-h-dvh h-dvh min-h-dvh bg-neutral-100 dark:bg-neutral-900 pb-4 flex flex-col ">
          <Header />
          <DebuggerApp />
          <CommandBar />
        </div>
        <ToastContainer
          autoClose={1000}
          transition={Slide}
          position="bottom-right"
          stacked
        />
      </TooltipProvider>
    </>
  );
}

function useAppInitializer() {
  return useEffect(() => {
    if (IS_DEBUG)
      toast.warn(
        <p>
          This app is running in development mode. Please use{" "}
          <code>npm start</code> instead.
        </p>,
      );
  }, []);
}
