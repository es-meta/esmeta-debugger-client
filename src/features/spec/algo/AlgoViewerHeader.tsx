import { cn } from "@/utils";
import { AlgoHeaderRighSide } from "./AlgoViewerHeader.side";
import { atoms, useAtomValue } from "@/atoms";

type Props = {
  fid: number;
  // algorithm: Algorithm;
  // name?: undefined;
};

export default function AlgoViewerHeader({ fid }: Props) {
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const irFunc = irFuncs[fid];
  const specInfo = irFunc.info;

  const isSdo = specInfo?.isSdo === true;

  const params = (
    specInfo?.isSdo === true || specInfo?.isMethod === true
      ? irFunc.params.slice(1)
      : irFunc.params
  )
    .map(({ name, optional }) => {
      return optional ? name + "?" : name;
    })
    .join(", ");

  const prodInfo = specInfo?.sdoInfo?.prod?.prodInfo;

  return (
    <>
      <div className="pt-2 px-2 font-es font-600 text-lg">
        <b>{irFunc.nameForContext}</b>
        <span className="algo-parameters">({params})</span>
        <AlgoHeaderRighSide fid={fid} />
      </div>
      {isSdo && (
        <div className="px-2 flex flex-col mb-1">
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
        <div className="px-2 flex flex-col mb-1">
          <p className="px-2 font-300">
            <b className="size-14 text-[#2aa198] italic font-es">
              {irFunc.params[0].name}
            </b>{" "}
            : <b className="size-14 font-es">{specInfo?.methodInfo[0]}</b>
          </p>
        </div>
      )}
    </>
  );
}

export function AlgoViewerHeaderUsingAlgoName({ name }: { name: string }) {
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const irFunc = Object.values(irFuncs).find(irFunc => irFunc.name === name);
  const specInfo = irFunc?.info;

  const isSdo = specInfo?.isSdo === true;

  const prodInfo = specInfo?.sdoInfo?.prod?.prodInfo;

  return (
    <>
      <div className="pt-2 px-2 font-es font-600 text-lg">
        <b>{irFunc?.nameForContext ?? name}</b>
        {/* <AlgoHeaderRighSide algorithm={algorithm} irToSpecMapping={irToSpecMapping} /> */}
      </div>
      {isSdo && (
        <div className="px-2 flex flex-col mb-1 font-es">
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
        <div className="px-2 flex flex-col mb-1">
          <p className="px-2 font-300">
            <b className="size-14 font-es">{specInfo?.methodInfo[0]}</b>
          </p>
        </div>
      )}
    </>
  );
}
