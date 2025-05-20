import { atom } from "jotai";
import { Breakpoint, BreakpointType } from "@/types";
import { doAPIDeleteRequest, doAPIPostRequest } from "@/api";

const items = atom<Breakpoint[]>([]);

export const bpAtom = atom(get => get(items));

export const serializedBpAtom = atom(get => {
  const breakpoints = get(items);
  return breakpoints.map(serialize);
});

export const addAction = atom(null, (get, set, update: Breakpoint) => {
  set(items, old => [...old, update]);
  doAPIPostRequest("breakpoint", serialize(update));
});

export const rmAction = atom(null, (get, set, update: "all" | number) => {
  if (update === "all") set(items, []);
  else set(items, old => old.toSpliced(update, 1));
  doAPIDeleteRequest("breakpoint", update);
});

//  toggleBreak: (state, action: PayloadAction<string | number>) => {
//       if (action.payload === "all") {
//         state.items.forEach(bp => (bp.enabled = !bp.enabled));
//       } else {
//         const i = Number(action.payload);
//         state.items[i].enabled = !state.items[i].enabled;
//       }
//     },
// doAPIPutRequest("breakpoint", action.payload)

// helper functions
export function serialize(bp: Breakpoint) {
  let data: [boolean, number, number[], boolean];
  if (bp.type == BreakpointType.Spec) {
    const { fid, steps, enabled } = bp;
    data = [false, fid, steps, enabled];
  } else {
    const { line, enabled } = bp;
    data = [true, line, [], enabled];
  }
  return data;
}
