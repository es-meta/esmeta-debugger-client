import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { reduxStore } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as JotaiProvider } from "jotai";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ToastContainer, Zoom } from "react-toastify";
import { jotaiStore } from "./atoms";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <JotaiProvider store={jotaiStore}>
      <ReduxProvider store={reduxStore}>
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
          skipDelayDuration={500}
        >
          <App />
          <ToastContainer
            autoClose={5000}
            transition={Zoom}
            position="bottom-right"
            stacked
          />
        </TooltipProvider>
      </ReduxProvider>
    </JotaiProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
