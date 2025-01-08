import { useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/ReactToastify.css";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/debugger-app/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";
import CookiePopup from "./CookiePopup";
import WelcomeModal from "./features/docs/welcome/Welcome";

export default function App() {
  useAppInitializer();

  return (<>
      <div className="min-h-dvh bg-neutral-100 dark:bg-neutral-800 pb-8 h-full flex flex-col">
        <Header />
        <DebuggerApp />
      </div>
      <ToastContainer autoClose={1000} transition={Slide} />
      <WelcomeModal />
    </>
  );
}

function useAppInitializer() {
  return useEffect(() => {
    toast.info(<CookiePopup />, { autoClose: false });

    if (IS_DEBUG)
      toast.warn(
        <p>
          This app is running in development mode. Please use{" "}
          <code>npm start</code> instead.
        </p>,
      );
  }, []);
}
