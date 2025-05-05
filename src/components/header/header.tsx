import { GITHUB_LINK_ESMETA, HOMEPAGE_LINK_ESMETA } from "@/constants";
import ConnectionSettings from "@/features/modal/connection/ConnectionSettings";
import SpecVersionView from "@/features/spec/SpecVersionView";
import ShareButton from "./share-button";
import WelcomeModal from "@/features/docs/welcome/Welcome";
import SettingButton from "./settings";
import { GitHubIcon } from "../icon";

export default function Header() {
  return (
    <nav className="min-h-11 max-h-11 h-11 w-full text-sm xl:px-12 transition-[padding] flex flex-row justify-between items-center px-4">
      <Left />
      <Right />
    </nav>
  );
}

function Left() {
  return (
    <div className="flex flex-row items-center justify-start">
      <span className="font-400 text-base text-ellipsis overflow-hidden line-clamp-1">
        <a
          className="hover:underline"
          href={HOMEPAGE_LINK_ESMETA}
          target="_blank"
          rel="noopener noreferrer"
          title="Open ESMeta Official Homepage"
        >
          <img
            src={new URL("@resources/icon.jpeg", import.meta.url).href}
            aria-hidden
            alt="ESMeta Logo"
            className="size-[1.25em] align-text-top inline-block mr-1 rounded-sm"
          />
          <b className="font-800">ESMeta</b>
        </a>
        <span className=""> / Double Debugger Playground</span>
      </span>
    </div>
  );
}

function Right() {
  return (
    <div className="flex flex-row items-center justify-end md:gap-1">
      <ShareButton />
      <a
        className="flex flex-row gap-1 items-center text-lg font-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg active:scale-90 transition-all cursor-pointer p-2"
        href={GITHUB_LINK_ESMETA}
        target="_blank"
        rel="noopener noreferrer"
        title="Discover ESMeta Project on GitHub"
      >
        <GitHubIcon />
      </a>
      <WelcomeModal />
      <SettingButton />
      <div className="h-6 px-1 flex flex-row">
        <div className="w-[1px] h-6 bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <ConnectionSettings />
      <SpecVersionView />
    </div>
  );
}
