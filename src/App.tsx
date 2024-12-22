import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";
import CookiePopup from "./CookiePopup";

const App = () => {
  return (
    <div className="min-h-dvh bg-neutral-100 pb-16">
      <ToastContainer autoClose={3000} hideProgressBar={true} />
      <Header />
      <WarnDebugMode />
      <DebuggerApp />
    </div>
  );
};

export default App;

function WarnDebugMode() {
  useEffect(() => {

    toast.info(
      <p>
        {`This app use cookies to enhace user experience.`}<CookiePopup />  </p>, {
        autoClose: false,
    });

    if (IS_DEBUG)
      toast.warn(
        `Warning: This app is running in development mode,
      which can cause weird behaviors. Please use 'npm start'.`,
      );
  });

  return null;
}