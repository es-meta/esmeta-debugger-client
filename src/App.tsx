import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";

const App = () => {
  return (
    <div className="min-h-dvh bg-neutral-100 pb-16">
      <ToastContainer autoClose={3000} hideProgressBar={true} />
      <Header />
      <WarnDebugMode />
      <Welcome />
      <DebuggerApp />
    </div>
  );
};

export default App;

function WarnDebugMode() {
  const [open, setOpen] = useState(true);

  if (!IS_DEBUG || !open) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 z-50 touch-none">
      <div
        className="bg-yellow-200 text-yellow-800 p-4 rounded-xl"
        onClick={() => setOpen(false)}
      >
        <p className="text-lg font-bold">Warning: Debug Mode</p>
        <p className="text-sm">
          This app is running in React's strict mode, which can cause weird
          behaviors. Please use{" "}
          <code className="text-neutral-800">npm start</code> to use optimized
          build.
        </p>
      </div>
    </div>
  );
}

function Welcome() {
  const [open, setOpen] = useState(true);

  return null;
  if (!IS_DEBUG || !open) return null;

  return (
    <div className="fixed top-0 left-0 m-4 z-50 touch-none">
      <div
        className="bg-yellow-200 text-yellow-800 p-4"
        onClick={() => setOpen(false)}
      >
        <p className="text-lg font-bold">
          Welcome to ESMeta JavaScript Double Debugger
        </p>
        <p className="text-sm">
          This app is running in React's strict mode, which can cause weird
          behaviors. Please use{" "}
          <code className="text-neutral-800">npm start</code> to use optimized
          build.
        </p>
      </div>
    </div>
  );
}
