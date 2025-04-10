export interface HeapObjRecord {
  type: "RecordObj";
  tname: string;
  map: Record<string, string | undefined>;
  stringform: string;
}

export interface HeapObjList {
  type: "ListObj";
  values: Array<string>;
  stringform: string;
}

export interface HeapObjMap {
  type: "MapObj";
  map: Record<string, string | undefined>;
  stringform: string;
}

export interface HeapObjYet {
  type: "YetObj";
  tname: string;
  stringform: string;
}

// types for ir state
// beautified addr and value
export type HeapObj = HeapObjRecord | HeapObjList | HeapObjMap | HeapObjYet;

export type Heap = { [addr: string]: HeapObj | undefined };
