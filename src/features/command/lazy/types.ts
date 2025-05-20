import type { WritableAtom } from "jotai";

export type CommandObjJotai = {
  type: "atom";
  // eslint-disable-next-line
  atom: WritableAtom<null, [], any>;
};

export type CommandObjFunc = {
  type: "func";
  func: () => unknown;
};

export interface Command {
  label: string;
  searchTarget: string;
  target: CommandObjJotai | CommandObjFunc | null;
}
