import { atoms, useAtomValue } from "@/atoms";

export default function InternalStatView() {
  const [isPending, result] = useAtomValue(atoms.state.resultAtom);
  const stepCnt = result.stepCnt;
  const instCnt = result.instCnt;

  return (
    <div className="data-[stale=true]:opacity-50" data-stale={isPending}>
      <h1>Internal Stat Viewer</h1>
      <pre className="whitespace-pre-line">
        Step: {stepCnt}
        instCnt: {instCnt}
        {/* {JSON.stringify(isPending)} */}
      </pre>
    </div>
  );
}
