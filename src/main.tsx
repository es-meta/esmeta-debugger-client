import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as JotaiProvider } from "jotai";
import { RegisterAtoms } from "./atoms/register";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <JotaiProvider>
        <App />
        <RegisterAtoms />
      </JotaiProvider>
    </ReduxProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
