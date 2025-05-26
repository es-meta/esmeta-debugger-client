import { atom } from "jotai";
import { Breakpoint } from "@/types";
import { doAPIDeleteRequest, doAPIPostRequest } from "@/api";
import { toast } from "react-toastify";

const items = atom<Breakpoint[]>([]);

export const bpAtom = atom(get => get(items));

export const serializedBpAtom = atom(get => {
  const breakpoints = get(items);
  return breakpoints.map(serialize);
});

export const addAction = atom(null, (get, set, update: Breakpoint) => {
  set(items, old => [...old, update]);
  doAPIPostRequest("breakpoint", serialize(update)).then(b => {
    if (!b) {
      toast.warn(
        `Unable to add break point \`${update.algoName} @ [${update.steps.join(",")}]\`. This most likely happens when the algorithm was manually modeled instead of being compiled. If you believe this isn’t the case, please report it — it could be a bug.`,
      );
      set(items, old => old.toSpliced(old.length - 1, 1));
    }
  });
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
  let data: [boolean, string, number[], boolean];
  const { algoName, steps, enabled } = bp;
  data = [false, algoName, steps, enabled];
  return data;
}
