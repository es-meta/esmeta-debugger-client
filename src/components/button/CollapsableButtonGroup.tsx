import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function CollapsableButtonGroup({ children }: Props) {
  return (
    <>
      <div className="flex-row flex-wrap justify-start pr-[1px] *:-mr-[1px] hidden lg:flex">
        {children}
      </div>
      <div className="lg:hidden">
        <Big />
      </div>
    </>
  );
}

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LinkIcon, MenuIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function Big() {
  return (
    <Menu>
      {({ open }) => (
        <>
          <MenuButton className="p-2 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-300 rounded-md transition-all">
            <MenuIcon size={18} />
          </MenuButton>
          <AnimatePresence>
            {open && (
              <MenuItems
                static
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.0625 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.0625 },
                }}
                anchor="bottom end"
                className="z-[1002] origin-top-right bg-white p-1 border border-neutral-300 rounded-md shadow-lg m-1 w-48 text-sm"
              >
                <MenuItem disabled>
                  <a
                    className="flex flex-row justify-start items-center gap-1 p-1 data-[disabled]:opacity-50 data-[focus]:bg-blue-100"
                    href="/settings"
                  >
                    <LinkIcon size={12} />
                    go to ECMA-262
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    className="block p-1 data-[focus]:bg-blue-100"
                    href="/support"
                  >
                    add to breakpoint
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    className="block p-1 data-[focus]:bg-blue-100"
                    href="/license"
                  >
                    ...
                  </a>
                </MenuItem>
              </MenuItems>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  );
}
