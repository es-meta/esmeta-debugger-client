import { ReduxState } from "@/store";
import { useSelector } from "react-redux";

export default function InternalStatViewer() {
  const debugString = useSelector(
    (state: ReduxState) => state.stats.debugString,
  );

  return (
    <div>
      <h1>Internal Stat Viewer</h1>
      <pre className="whitespace-pre-line">{debugString}</pre>
    </div>
  );
}
