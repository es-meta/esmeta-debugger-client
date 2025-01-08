export interface HeapObjRecord {
  type: "RecordObj";
  tname: string;
  map: Record<string, string>;
  stringform: string;
}

export interface HeapObjList {
  type: "ListObj";
  values: Record<string, string>;
  stringform: string;
}

export interface HeapObjMap {
  type: "MapObj";
  map: Record<string, string>;
  stringform: string;
}

export interface HeapObjYet {
  type: "YetObj";
  tname: Record<string, string>;
  stringform: string;
}

// types for ir state
// beautified addr and value
export type HeapObj = HeapObjRecord | HeapObjList | HeapObjMap | HeapObjYet;

export type Heap = { [addr: string]: HeapObj };
