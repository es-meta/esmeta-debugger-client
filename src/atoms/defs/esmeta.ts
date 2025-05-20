import { atom } from "jotai";
import { givenConfigAtom } from "./config";
import { instantiateWorker } from "@/api";

export const esmetaAtom = atom(async get => {
  const givenConfig = get(givenConfigAtom);
  return instantiateWorker(givenConfig.api);
});
