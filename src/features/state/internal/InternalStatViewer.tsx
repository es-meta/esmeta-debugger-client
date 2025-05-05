import { useAppSelector } from "@/hooks";

export default function InternalStatViewer() {
  const debugString = useAppSelector(st => st.stats.debugString);

  return (
    <div>
      <h1>Internal Stat Viewer</h1>
      <pre className="whitespace-pre-line">{debugString}</pre>
    </div>
  );
}
