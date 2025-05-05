import { atoms, useAtomValue } from "@/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SPEC_URL } from "@/constants";
import { useCopyCallback } from "@/hooks/use-copy-callback";
import { Algorithm } from "@/types";

export function AlgoHeaderRighSide({ algorithm }: { algorithm: Algorithm }) {
  const irToSpecMapping = useAtomValue(atoms.spec.irToSpecNameMapAtom);
  const devMode = useAtomValue(atoms.app.devModeAtom);
  const specInfo = irToSpecMapping[algorithm.name];
  const CONTAINS = specInfo !== undefined;

  const [isCopied, handleClick] = useCopyCallback(algorithm.code);

  return CONTAINS ? (
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
  ) : null;
}
