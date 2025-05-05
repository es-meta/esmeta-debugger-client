import type { Action } from "@/store";
import type { WritableAtom } from "jotai";

export type CommandObjRedux = {
  type: "redux";
  action: Action;
};

export type CommandObjJotai = {
  type: "atom";
  atom: WritableAtom<void, [], unknown>;
};

export interface Command {
  label: string;
  searchTarget: string;
  target: CommandObjRedux | CommandObjJotai | null;
}
