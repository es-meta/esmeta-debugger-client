/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

type ValuesOf<T> = T[keyof T];

type DisjointBooleanFlag<K extends string> = {
  [Key in K]: {
    [P in Key]: true;
  } & Partial<Record<Exclude<K, Key>, undefined>>;
}[K];
