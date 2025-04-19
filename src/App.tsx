import { useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/debugger-app/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import CommandBar from "./features/command/CommandBar";

export default function App() {
  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={10000}>
      <div className="max-h-dvh h-dvh min-h-dvh bg-neutral-100 dark:bg-neutral-900 xl:pb-4 flex flex-col">
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
      <AppInitializer />
    </TooltipProvider>
  );
}

function AppInitializer() {
  useEffect(() => {
    if (IS_DEBUG)
      toast.warn(
        <p>
          This app is running in development mode. Please use{" "}
          <code>npm start</code> instead.
        </p>,
      );
  }, []);

  return null;
}
