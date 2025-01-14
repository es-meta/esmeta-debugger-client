import { ReactElement, type ReactNode } from "react";
interface Props {
  icon?: ReactElement<SVGAElement>;
  label: ReactNode;
  children: React.ReactNode[];
}

export default function ToolbarButtonGroup({ icon, label, children }: Props) {
  return (
    <>
      <div className="flex-row flex-wrap justify-start pr-[1px] *:-mr-[1px] hidden md:flex">
        {children}
      </div>
      <div className="md:hidden">
        <Menu
        >
          {({ open }) => (
            <>
              <MenuButton className="[&>svg]:size-4 dark:text-white [&>svg]:inline-block gap-[2px] flex flex-row items-center uppercase text-xs font-500 px-2 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 hover:dark:bg-neutral-800 active:bg-neutral-200 active:dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-md transition-all">
                {icon || <MenuIcon />}
                {label}
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
                    className="z-[1002] origin-top-right bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-lg m-1 w-64 text-sm"
                  >
                    {children
                      .filter(v => typeof v !== "boolean")
                      .flatMap((b, idx) => (
                        <MenuItem key={idx}>{b}</MenuItem>
                      ))}
                  </MenuItems>
                )}
              </AnimatePresence>
            </>
          )}
        </Menu>
      </div>
    </>
  );
}

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { MenuIcon } from "lucide-react";
