import { atoms, useAtomValue } from "@/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SPEC_URL } from "@/constants";
import { useCopyCallback } from "@/hooks/use-copy-callback";

export function AlgoHeaderRighSide({ fid }: { fid: number }) {
  const devMode = useAtomValue(atoms.app.devModeAtom);
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const irFunc = irFuncs[fid];
  const specInfo = irFunc.info;
  const CONTAINS = specInfo !== undefined;

  const [isCopied, handleClick] = useCopyCallback(irFunc.algoCode);

  if (!CONTAINS) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          asChild
          className="font-sans text-xs ml-1 font-600 px-1"
        >
          <a href={`${SPEC_URL}#${specInfo.htmlId}`} target="_blank">
            🔗
          </a>
        </TooltipTrigger>
        <TooltipContent>{`${SPEC_URL}#${specInfo.htmlId}`}</TooltipContent>
      </Tooltip>
      {devMode && (
        <button className={"font-sans text-xs ml-1 px-1"} onClick={handleClick}>
          {isCopied ? "✅" : "📃"}
        </button>
      )}
    </>
  );
}
