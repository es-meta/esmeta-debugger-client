import { useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/ReactToastify.css";

import Header from "@/components/custom/Header";
import DebuggerApp from "@/features/debugger-app/DebuggerApp";
import { IS_DEBUG } from "./constants/constant";
import CookiePopup from "./CookiePopup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import WelcomeModal from "./features/docs/welcome/Welcome";

const queryClient = new QueryClient();

export default function App() {
  useAppInitializer();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-dvh bg-neutral-100 dark:bg-neutral-800 pb-16 h-full flex flex-col">
        <Header />
        <DebuggerApp />
      </div>
      <ToastContainer autoClose={3000} transition={Slide} />
      <WelcomeModal />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
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
