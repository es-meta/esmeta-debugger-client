import { ChevronRight, GithubIcon } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import StateTransition from "./StateTransition";
import { Separator } from "@radix-ui/react-separator";
 
export function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <ChevronRight />
    </Button>
  )
}


function Header() {

  return <nav className="w-full border-b border-b-neutral-300">
    <div className="bg-white bg-opacity-75 h-14 w-full text-sm lg:px-24 flex flex-row justify-start gap-3 items-center px-4">

      <div className="font-800 text-lg flex flex-row items-center gap-1">
        <img src="/icon.jpeg" aria-hidden alt="ESMeta Logo" className="h-6 w-6" />
        ESMeta
      </div>


      <div className="text-neutral-500">
          Docs
      </div>

        <div className="text-neutral-500">
          Playground
        </div>
    
          
      <div className="text-neutral-500">
        GitHub
      </div>
        

        {/* <Button>
          <ChevronRight />
          <GithubIcon />
        </Button> */}

      </div>
    </nav>;
};

export default Header;
