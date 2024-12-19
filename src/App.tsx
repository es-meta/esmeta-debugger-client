import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";
import DebuggerApp from "@/features/DebuggerApp";

const App = () => {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <ToastContainer autoClose={3000} hideProgressBar={true} />
      <Header />
      <div className="relative">
        <DebuggerApp />
      </div>
      <Footer />
    </div>
  );
};

export default App;
