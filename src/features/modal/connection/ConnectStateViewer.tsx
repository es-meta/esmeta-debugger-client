import { motion, AnimatePresence } from "motion/react";
import {
  CheckIcon,
  CogIcon,
  Loader2Icon,
  LoaderPinwheelIcon,
  CircleAlertIcon,
  ServerIcon,
  ServerOffIcon,
} from "lucide-react";
import { ReactElement } from "react";
import { twJoin } from "tailwind-merge";
import { useAtomValue, ExtractAtomValue } from "jotai";
import { givenConfigAtom } from "@/atoms/defs/config";
import { busyStateGetter } from "@/atoms/defs/app";
import { atoms } from "@/atoms";

interface SingleProps {
  adaptive?: boolean;
  className?: string;
  icon: ReactElement<SVGElement>;
  text: string;
  content: string;
}

function Single({ adaptive = false, className, icon, text }: SingleProps) {
  return (
    <div
      className={twJoin(
        "size-full flex flex-row gap-[0.1em] [&>svg]:size-[1em] [&>svg]:text-lg items-center rounded-lg text-xs uppercase font-700 font-mono",
        className,
        adaptive
          ? "justify-center md:justify-start"
          : "justify-start md:justify-start",
      )}
    >
      {icon}
      <span className="grow truncate text-center hidden md:inline">{text}</span>
    </div>
  );
}

function ConnectState({
  type,
  busyState,
  adaptive = false,
}: {
  type: string;
  busyState: ExtractAtomValue<typeof atoms.app.busyStateGetter>;
  adaptive?: boolean;
}) {
  if (type === "http")
    switch (busyState) {
      case "init":
        return (
          <Single
            adaptive={adaptive}
            className="text-yellow-500"
            icon={<Loader2Icon className="animate-spin" />}
            text="Init"
            content="Loading..."
          />
        );
      case "connected":
        return (
          <Single
            adaptive={adaptive}
            className="text-green-500"
            icon={<ServerIcon />}
            text="Ready"
            content="Connected to ESMeta backend"
          />
        );
      case "busy":
        return (
          <Single
            adaptive={adaptive}
            className="text-blue-500"
            icon={<LoaderPinwheelIcon className="animate-spin" />}
            text="Busy"
            content="ESMeta backend is working"
          />
        );
      case "not_connected":
        return (
          <Single
            adaptive={adaptive}
            className="text-red-500"
            icon={<ServerOffIcon />}
            text="Lost"
            content="Lost connection to ESMeta backend"
          />
        );
    }

  switch (busyState) {
    case "init":
      return (
        <Single
          adaptive={adaptive}
          className="text-yellow-500"
          icon={<CogIcon className="animate-spin" />}
          text="Build"
          content="Preparing ESMeta backend on Web Worker"
        />
      );

    case "connected":
      return (
        <Single
          adaptive={adaptive}
          className="text-green-500"
          icon={<CheckIcon />}
          text="Ready"
          content="ESMeta backend is ready"
        />
      );
    case "busy":
      return (
        <Single
          adaptive={adaptive}
          className="text-blue-500"
          icon={<LoaderPinwheelIcon className="animate-spin" />}
          text="Busy"
          content="ESMeta backend is working"
        />
      );
    case "not_connected":
      return (
        <Single
          adaptive={adaptive}
          className="text-red-500"
          icon={<CircleAlertIcon />}
          text="Lost"
          content="ESMeta backend is not available; maybe crashed"
        />
      );
  }
}

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

interface Props {
  adaptive?: boolean;
}

export default function ConnectStateViewer({ adaptive = false }: Props) {
  const config = useAtomValue(givenConfigAtom);
  const state = useAtomValue(busyStateGetter);

  return (
    <div className="relative w-8 md:w-16 h-7">
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          className="absolute size-full"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.0625,
          }}
        >
          <ConnectState
            adaptive={adaptive}
            busyState={state}
            type={config.api.type}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
