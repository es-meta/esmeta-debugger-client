import { atoms, useAtomValue } from "@/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SPEC_URL } from "@/constants";
import { useCopyCallback } from "@/hooks/use-copy-callback";
import { Algorithm, IrToSpecMapping } from "@/types";
import { cn } from "@/utils";

function Info({
  algorithm,
  irToSpecMapping,
}: {
  algorithm: Algorithm;
  irToSpecMapping: IrToSpecMapping;
}) {
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

export default function AlgoViewerHeader({
  algorithm,
  irToSpecMapping,
}: {
  algorithm: Algorithm;
  irToSpecMapping: IrToSpecMapping;
}) {
  const specInfo = irToSpecMapping[algorithm.name];

  const title = (() => {
    if (specInfo?.sdoInfo && specInfo.isSdo === true) {
      return specInfo.sdoInfo.method;
    }

    if (specInfo?.isBuiltIn === true) {
      return algorithm.name.substring("INTRINSICS.".length);
    }

    if (specInfo?.methodInfo) {
      const [, mn] = specInfo.methodInfo;
      return mn;
    }

    return algorithm.name;
  })();

  const isSdo = specInfo?.isSdo === true;

  const params = (
    specInfo?.isSdo === true || specInfo?.isMethod === true
      ? algorithm.params.slice(1)
      : algorithm.params
  )
    .map(({ name, optional }) => {
      return optional ? name + "?" : name;
    })
    .join(", ");

  const prodInfo = specInfo?.sdoInfo?.prod?.prodInfo;

  return (
    <>
      <div className="pt-2 px-2 font-es font-600 text-lg">
        <b>{title}</b>
        <span className="algo-parameters">({params})</span>
        <Info algorithm={algorithm} irToSpecMapping={irToSpecMapping} />
      </div>
      {isSdo && (
        <div className="px-2 flex flex-col mb-1 break-all">
          {prodInfo && (
            <p className="ml-4">
              <b className="inline font-300 italic">
                {specInfo.sdoInfo?.prod?.astName}
              </b>
              <b className="inline font-700">&nbsp;:</b>
              {prodInfo.map((prod, idx) => (
                <b
                  key={idx}
                  className={cn(
                    "inline",
                    prod.type === "terminal" && "font-700 font-mono text-sm",
                    prod.type === "nonterminal" && "font-300 italic",
                  )}
                >
                  &nbsp;{prod.value}
                </b>
              ))}
            </p>
          )}
        </div>
      )}
      {specInfo?.methodInfo && (
        <div className="px-2 flex flex-col mb-1 break-all">
          <p className="px-2 font-300">
            <b className="size-14 text-[#2aa198] italic font-es">
              {algorithm.params[0].name}
            </b>{" "}
            : <b className="size-14 font-es">{specInfo?.methodInfo[0]}</b>
          </p>
        </div>
      )}
    </>
  );
}

export function AlgoViewerHeaderUsingOnlyName({
  name,
  irToSpecMapping,
}: {
  name: string;
  irToSpecMapping: IrToSpecMapping;
}) {
  const specInfo = irToSpecMapping[name];

  const title = (() => {
    if (specInfo?.sdoInfo && specInfo.isSdo === true) {
      return specInfo.sdoInfo.method;
    }

    if (specInfo?.isBuiltIn === true) {
      return name.substring("INTRINSICS.".length);
    }

    if (specInfo?.methodInfo) {
      const [, mn] = specInfo.methodInfo;
      return mn;
    }

    return name;
  })();

  const isSdo = specInfo?.isSdo === true;

  // const params = (
  //   (specInfo?.isSdo === true || specInfo?.isMethod === true)  ?
  //   algorithm.params.slice(1)
  //   :
  //   algorithm.params
  // )
  //   .map(({ name, optional }) => {
  //       return optional ? name + "?" : name;
  //     })
  //   .join(", ");

  const prodInfo = specInfo?.sdoInfo?.prod?.prodInfo;

  return (
    <>
      <div className="pt-2 px-2 font-es font-600 text-lg">
        <b>{title}</b>
        <Info algorithm={algorithm} irToSpecMapping={irToSpecMapping} />
      </div>
      {isSdo && (
        <div className="px-2 flex flex-col mb-1 break-all font-es">
          {prodInfo && (
            <p className="ml-4">
              <b className="inline font-300 italic">
                {specInfo.sdoInfo?.prod?.astName}
              </b>
              <b className="inline font-700">&nbsp;:</b>
              {prodInfo.map((prod, idx) => (
                <b
                  key={idx}
                  className={cn(
                    "inline",
                    prod.type === "terminal" && "font-700 font-mono text-sm",
                    prod.type === "nonterminal" && "font-300 italic",
                  )}
                >
                  &nbsp;{prod.value}
                </b>
              ))}
            </p>
          )}
        </div>
      )}
      {specInfo?.methodInfo && (
        <div className="px-2 flex flex-col mb-1 break-all">
          <p className="px-2 font-300">
            <b className="size-14 text-black font-es">
              {specInfo?.methodInfo[0]}
            </b>
          </p>
        </div>
      )}
    </>
  );
}
