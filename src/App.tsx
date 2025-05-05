import { lazy } from "react";
import { DeferUntilIdle } from "./components/defer-until-idle";

import Header from "./components/header/header";
import DebuggerApp from "./features/debugger-app/DebuggerApp";
const CommandBar = lazy(() => import("./features/command/CommandBar"));

export default function App() {
  return (
    <div className="max-h-dvh h-dvh min-h-dvh flex flex-col">
      <Header />
      <DebuggerApp />
      <DeferUntilIdle>
        <CommandBar />
      </DeferUntilIdle>
    </div>
  );
}
