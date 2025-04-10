import { Action } from "@/store";

export interface Command {
  label: string;
  searchTarget: string;
  // NOTE we have a stable reference to the redux store - useDispatch is stable - so next actions can be dispatched
  actions: Action[];
}
