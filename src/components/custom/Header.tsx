import { ChevronRight } from "lucide-react";
import { GithubIcon } from "lucide-react";
import { Button } from "@headlessui/react";

export function ButtonIcon() {
  return (
    <Button>
      <ChevronRight />
    </Button>
  );
}

function Header() {
  return (
    <nav className="w-full border-b border-b-neutral-300">
      <div className="bg-white bg-opacity-75 h-14 w-full text-sm lg:px-24 flex flex-row justify-start gap-3 items-center px-4">
        <div className="font-800 text-lg flex flex-row items-center gap-1">
          <img
            src="/icon.jpeg"
            aria-hidden
            alt="ESMeta Logo"
            className="h-6 w-6"
          />
          ESMeta
        </div>

        <div className="text-neutral-500">Docs</div>

        <div className="text-neutral-500">Playground</div>

        <div className="text-neutral-500">GitHub</div>

        {/* <Button>
          <ChevronRight />
          <GithubIcon />
        </Button> */}

      <div className="flex flex-row gap-8">
      <div>
        <GithubIcon style={{ fontSize: 24 }} />
        ESMeta
      </div>
      <div>
        <GithubIcon style={{ fontSize: 24 }} />
        ESMeta Debugger
      </div>
    </div>
      </div>
    </nav>
  );
}

export default Header;
