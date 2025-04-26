import { logger } from "@/constants/constant";
import { Heap } from "@/types/heap.types";

export type Binding = [string, string | undefined];

function GetBindingValue_Global(
  heap: Heap,
  envRecAddress: string,
  // envRec: Record[GlobalEnvironmentRecord],
  // N: String,
  // S: Boolean,
): Binding[] {
  const arr: Binding[] = [];

  // let DclRec = envRec.DeclarativeRecord
  const envRec = heap[envRecAddress];
  if (!envRec || envRec.type !== "RecordObj") return [];

  const DclRecAddr = envRec.map["DeclarativeRecord"];
  const DclRec = DclRecAddr ? heap[DclRecAddr] : null;
  if (DclRecAddr && DclRec && DclRec.type === "RecordObj") {
    const fromDecls = GetBindingValue_Declarative(heap, DclRecAddr);

    for (const [name, value] of fromDecls) {
      if (arr.every(([n]) => n !== name)) arr.push([name, value]);
    }
  }

  // call %0 = DclRec.HasBinding(DclRec, N)
  // assert (? %0: Normal)
  // %0 = %0.Value
  // if (= %0 true) {
  //   call %1 = DclRec.GetBindingValue(DclRec, N, S)
  //   assert (? %1: Completion)
  //   if (? %1: Abrupt) return %1
  //   else return %1
  // }

  const objRecAddr = envRec.map["ObjectRecord"];
  const ObjRec = objRecAddr ? heap[objRecAddr] : null;
  if (objRecAddr && ObjRec && ObjRec.type === "RecordObj") {
    const fromObjects = GetBindingValue_Object(heap, objRecAddr);
    // let ObjRec = envRec.ObjectRecord
    // call %2 = ObjRec.GetBindingValue(ObjRec, N, S)
    // assert (? %2: Completion)
    // if (? %2: Abrupt) return %2
    // else return %2

    for (const [name, value] of fromObjects) {
      if (arr.every(([n]) => n !== name)) arr.push([name, value]);
    }
  }

  return arr;
}

function GetBindingValue_Object(
  heap: Heap,
  envRecAddress: string,
  // envRec: Record[ObjectEnvironmentRecord],
  // N: String,
  // S: Boolean,
): Binding[] {
  const arr: Binding[] = [];

  const envRec = heap[envRecAddress];
  if (!envRec || envRec.type !== "RecordObj") return [];

  // let bindingObject = envRec.BindingObject
  const bindingObjectAddr = envRec.map["BindingObject"];
  const bindingObject = bindingObjectAddr ? heap[bindingObjectAddr] : null;
  const subMapAddr =
    bindingObject && bindingObject.type === "RecordObj"
      ? bindingObject.map["__MAP__"]
      : null;
  const subMap = subMapAddr ? heap[subMapAddr] : null;

  if (subMap && subMap.type === "MapObj") {
    for (const [name, value] of Object.entries(subMap.map)) {
      if (arr.every(([n]) => n !== name)) arr.push([name, value]);
    }
  }

  return arr;
}

function GetBindingValue_Declarative(
  heap: Heap,
  envRecAddress: string,
): Binding[] {
  const arr: Binding[] = [];

  const envRec = heap[envRecAddress];
  if (!envRec || envRec.type !== "RecordObj") return [];
  // assert (exists envRec.__MAP__[N])

  const subMapAddr = envRec.map["__MAP__"];
  const subMap = subMapAddr ? heap[subMapAddr] : null;
  if (subMapAddr && subMap && subMap.type === "MapObj") {
    for (const [name, value] of Object.entries(subMap.map)) {
      if (arr.every(([n]) => n !== name)) arr.push([name, value]);
    }
  }
  // if (! envRec.__MAP__[N].initialized) {
  //   call __errObj__ = clo<"__NEW_ERROR_OBJ__">("%ReferenceError.prototype%")
  //   call __comp__ = clo<"ThrowCompletion">(__errObj__)
  //   {
  //     if (? __comp__: Completion) return __comp__
  //     call %0 = clo<"NormalCompletion">(__comp__)
  //     return %0
  //   }
  // }

  return arr;
  // %1 = envRec.__MAP__[N].BoundValue
  // if (? %1: Completion) return %1
  // call %2 = clo<"NormalCompletion">(%1)
  // return %2
}

function Specialized_GetBindingThisValue(
  heap: Heap,
  envRecAddress: string,
): Binding[] {
  const envRec = heap[envRecAddress];

  if (!envRec || envRec.type !== "RecordObj") {
    logger.error(
      "Specialized_GetBindingThisValue",
      `envRec not found at ${envRecAddress}`,
    );
    return [];
  }
  const bindingStatus = envRec.map["ThisBindingStatus"];
  if (bindingStatus === "~uninitialized~") return [];

  const thisValue = envRec.map["ThisValue"];
  if (thisValue) return [['"this"', thisValue]];
  return [];
}

export function GetBindingValue(heap: Heap, envRecAddress: string): Binding[] {
  // logger.log('GetBindingValue', `envRecAddress: ${envRecAddress}`);

  const envRec = heap[envRecAddress];
  if (!envRec || envRec.type !== "RecordObj") {
    logger.error("GetBindingValue", `envRec not found at ${envRecAddress}`);
    return [];
  }

  switch (envRec.tname) {
    case "GlobalEnvironmentRecord":
      // logger.log('GetBindingValue', `GlobalEnvironmentRecord`);
      return GetBindingValue_Global(heap, envRecAddress);
    case "ObjectEnvironmentRecord":
      // logger.log('GetBindingValue', `ObjectEnvironmentRecord`);
      return GetBindingValue_Object(heap, envRecAddress);
    case "DeclarativeEnvironmentRecord":
      // logger.log('GetBindingValue', `DeclarativeEnvironmentRecord`);
      return GetBindingValue_Declarative(heap, envRecAddress);
    case "FunctionEnvironmentRecord":
      return Specialized_GetBindingThisValue(heap, envRecAddress).concat(
        GetBindingValue_Declarative(heap, envRecAddress).filter(
          ([name]) => name !== '"this"',
        ),
      );
    // throw new Error('FunctionEnvironmentRecord not implemented');
    default:
      logger.error(
        "GetBindingValue",
        `Unknown environment record type: ${envRec.tname}`,
      );
      return [];
  }
}
