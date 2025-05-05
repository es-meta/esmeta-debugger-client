import type { Action } from "@/store";

export interface Command {
  label: string;
  searchTarget: string;
  action: Action | null;
}
