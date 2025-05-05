import { Funnel1, Funnel2, Funnel3, Funnel4 } from "./funnels";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";

interface Props {
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
}

const Funnels = [Funnel1, Funnel2, Funnel3, Funnel4];

export default function WelcomeContent({ idx, setIdx }: Props) {
  return (
    <>
      <div className="relative w-full h-[32rem] overflow-hidden ">
        {Funnels.map((Funnel, i) => (
          <Funnel key={i} show={idx === i} />
        ))}
      </div>
      <div className="fixed bottom-0 w-full p-4 flex flex-row gap-2 touch-none justify-center">
        <button
          className={twJoin("button-styled", idx > 0 ? "" : "invisible")}
          onClick={() => {
            setIdx(idx - 1);
          }}
        >
          <ArrowLeftIcon className="inline size-[1em]" />
        </button>
        <button className="button-styled" data-dialog-control="close">
          dive now
        </button>
        <button
          className={twJoin(
            "button-styled",
            idx < Funnels.length - 1 ? "" : "invisible",
          )}
          onClick={() => {
            setIdx(idx + 1);
          }}
        >
          <ArrowRightIcon className="inline size-[1em]" />
        </button>
      </div>
    </>
  );
}
