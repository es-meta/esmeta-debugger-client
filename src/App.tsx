import Header from "./components/header/header";
import DebuggerApp from "./DebuggerApp";

export default function App() {
  return (
    <div className="max-h-dvh h-dvh min-h-dvh flex flex-col">
      <Header />
      <DebuggerApp />
    </div>
  );
}
