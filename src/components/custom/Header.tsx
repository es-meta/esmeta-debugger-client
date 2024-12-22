import { GithubIcon } from "lucide-react";

function Header() {
  return (
    <nav className="bg-white border-b border-b-neutral-300 bg-opacity-75 h-14 w-full text-sm lg:px-24 flex flex-row justify-between gap-3 items-center px-4">
      <Left />
      <Right />
    </nav>
  );
}

function Left() {
  return (
    <div className="flex flex-row gap-2 items-center justify-start">
      <span className="font-800 text-lg flex flex-row items-center gap-1">
        <img
          src="/icon.jpeg"
          aria-hidden
          alt="ESMeta Logo"
          className="h-6 w-6"
        />
        ESMeta
      </span>

      <div className="text-neutral-500">Docs</div>

      <div className="text-neutral-500">Playground</div>

      <div className="text-neutral-500">GitHub</div>
    </div>
  );
}

function Right() {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-row gap-1 items-center">
        <span className="bg-black text-white rounded-full aspect-square items-center justify-center inline-flex size-6 overflow-hidden">
          <GithubIcon size={18} />
        </span>
        ESMeta
      </div>
      <div className="flex flex-row gap-1 items-center">
        <span className="bg-black text-white rounded-full aspect-square items-center justify-center inline-flex size-6 overflow-hidden">
          <GithubIcon size={18} />
        </span>
        ESMeta Debugger
      </div>
    </div>
  );
}

export default Header;
