import { motion, AnimatePresence } from "motion/react";
import { CheckIcon, CogIcon, Loader2Icon, PlugIcon } from "lucide-react";
import { LoaderPinwheelIcon, CircleAlertIcon } from "lucide-react";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { GIVEN_SETTINGS } from "@/constants/settings";
import { twJoin } from "tailwind-merge";

interface Props {
  className?: string;
  icon: ReactElement<SVGElement>;
  text: string;
}

function Single({ className, icon, text }: Props) {
  return (
    <div
      className={twJoin(
        "flex flex-row justify-start gap-1 [&>svg]:size-5 items-center rounded-lg text-xs uppercase font-800",
        className,
      )}
    >
      {icon}
      <span className="w-11 truncate text-left hidden md:inline">{text}</span>
    </div>
  );
}

const GIVEN_API = GIVEN_SETTINGS.api;

const connectState =
  GIVEN_API.type === "http"
    ? ({
        init: (
          <Single
            className="text-yellow-500"
            icon={<Loader2Icon className="animate-spin" />}
            text="Lost"
          />
        ),
        connected: (
          <Single className="text-green-500" icon={<PlugIcon />} text="Ready" />
        ),
        busy: (
          <Single
            className="text-blue-500"
            icon={<LoaderPinwheelIcon className="animate-spin" />}
            text="Busy"
          />
        ),
        not_connected: (
          <Single
            className="text-red-500"
            icon={<CircleAlertIcon />}
            text="Lost"
          />
        ),
      } as const)
    : ({
        init: (
          <Single
            className="text-yellow-500"
            icon={<CogIcon className="animate-spin" />}
            text="Build"
          />
        ),
        connected: (
          <Single
            className="text-green-500"
            icon={<CheckIcon />}
            text="Ready"
          />
        ),
        busy: (
          <Single
            className="text-blue-500"
            icon={<LoaderPinwheelIcon className="animate-spin" />}
            text="Busy"
          />
        ),
        not_connected: (
          <Single
            className="text-red-500"
            icon={<CircleAlertIcon />}
            text="Lost"
          />
        ),
      } as const);

function matchAppstate(st: ReduxState) {
  const x = st.appState.busy;
  const isInit = st.appState.state === AppState.INIT;
  if (x === 0) {
    return "connected";
  }
  if (x > 0) {
    return isInit ? "init" : "busy";
  }
  return "not_connected";
}

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export default function ConnectStateViewer() {
  const state = useSelector(matchAppstate);

  return (
    <div className="relative w-[1.25rem] md:w-[4.25rem] h-5 my-1 mx-1">
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          className="absolute"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            type: "tween",
            ease: "easeIn",
            duration: 0.0625,
          }}
        >
          {connectState[state]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
