import { Algorithm } from "@/types";
import { cn } from "@/utils";
import { AlgoHeaderRighSide } from "./AlgoViewerHeader.side";
import { atoms, useAtomValue } from "@/atoms";

type Props = {
  algorithm: Algorithm;
  name?: undefined;
};

export default function AlgoViewerHeader({ algorithm }: Props) {
  const irToSpecMapping = useAtomValue(atoms.spec.irToSpecNameMapAtom);
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
        <AlgoHeaderRighSide algorithm={algorithm} />
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
              {algorithm.params[0].name}
            </b>{" "}
            : <b className="size-14 font-es">{specInfo?.methodInfo[0]}</b>
          </p>
        </div>
      )}
    </>
  );
}

export function AlgoViewerHeaderUsingAlgoName({ name }: { name: string }) {
  const irToSpecMapping = useAtomValue(atoms.spec.irToSpecNameMapAtom);
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
