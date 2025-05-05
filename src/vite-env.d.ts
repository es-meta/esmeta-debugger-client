/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __DEFAULT_API_IS_BROWSER__: boolean;

type ValuesOf<T> = T[keyof T];

type DisjointBooleanFlag<K extends string> = {
  [Key in K]: {
    [P in Key]: true;
  } & Partial<Record<Exclude<K, Key>, undefined>>;
}[K];
