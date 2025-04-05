/// <reference lib="webworker" />

import type { ApiMessageData } from './message.type';
import type { Mocking } from './esmeta.type';

//////////////////////// import from Scala.js /////////////////////////

let ESMetaDebugger: Promise<Mocking> = (async () => {
  const module = await import('../../scalajs/target/scala-3.3.3/esmeta-worker-fastopt/main.mjs');
  return (await (await module.ESMetaSpec).build(""));
})();

////////////////////////////////////////////////////////////////////////


// json header
// const mkJSONHeader = (): Record<string, string> => {
//   const headers: { [index: string]: string } = {};
//   headers["Content-Type"] = "application/json";
//   headers["Accept"] = "application/json";
//   return headers;
// };

// trim slash
// const trim_slash = (input: string): string => {
//   return input.replace(/\/+$/, "").replace(/^\/+/, "");
// };

// make url for GET request
// const mkURL = (
//   host: string,
//   endpoint: string,
//   queryObj: { [key: string]: unknown } = {},
// ): string => {
//   let url = `${trim_slash(host)}/${trim_slash(endpoint)}`;
//   const listParams: string[] = [];
//   for (const key in queryObj) {
//     const entry = queryObj[key];
//     if (
//       typeof entry === "string" ||
//       typeof entry === "number" ||
//       typeof entry === "boolean"
//     ) {
//       const param = `${encodeURIComponent(key)}=${encodeURIComponent(
//         entry.toString(),
//       )}`;
//       listParams.push(param);
//     } else if (entry !== undefined || entry !== null) {
//       throw new Error(`Not supported entry type: ${typeof entry}(${entry})`);
//     }
//   }
//   if (listParams.length > 0) {
//     const querystring = listParams.join("&");
//     url += `?${querystring}`;
//   }
//   return url;
// };

const apiError =(s : String) => new Error(`Unknown API endpoint ${s}`);

// raw GET request
const doGetRequest = async (
  endpoint: Route,
  queryObj?: { [key: string]: unknown },
): Promise<unknown> => {



  switch (endpoint) {
    case 'spec/func':

      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).spec_func());
    
    case 'state/heap':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).state_heap());
    
    case 'state/callStack':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).state_callStack());
    
    default:

      if (endpoint.startsWith('state/context/')) {
        // @ts-expect-error TODO type definition
        return JSON.parse((await ESMetaDebugger).state_context(Number(endpoint.split('/').at(2))));
      }

      throw apiError(endpoint);
  }
};

import { Route } from './route.type';

// raw POST-like request
const doWriteRequest = async (
  method: HTTPMethod,
  endpoint: Route,
  bodyObj?: string,
): Promise<unknown> => {



  switch (endpoint) {
      
    case 'breakpoint':
      console.log('got breakpoint request')
      switch (method) {
        case 'POST':
          // @ts-expect-error TODO type definition
          return JSON.parse((await ESMetaDebugger).breakpoint_add( bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined));
        case 'DELETE':
          // @ts-expect-error TODO type definition
          return JSON.parse((await ESMetaDebugger).breakpoint_remove( bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined));
        case 'PUT':
          // @ts-expect-error TODO type definition
          return JSON.parse((await ESMetaDebugger).breakpoint_toggle( bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined));
        default:
          throw apiError(endpoint);
      }
  

    case 'exec/run':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_run( bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined));
    
    case 'exec/specStep':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_step());
    case 'exec/specStepOver':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_stepOver());

    case 'exec/specStepOut':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_stepOut());

    case 'exec/specContinue':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_continue());

      
    case 'exec/esStep':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_esStep());
    case 'exec/esStepOver':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_esStepOver());
      
    case 'exec/esStepOut':
      // @ts-expect-error TODO type definition
      return JSON.parse((await ESMetaDebugger).exec_esStepOut());



    default:

      
    
      throw apiError(endpoint);
        // const url = mkURL(host, endpoint);
        // const response = await fetch(url, {
        //   method,
        //   headers: {
        //     ...(bodyObj ? mkJSONHeader() : undefined),
        //   },
        //   body: bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined,
        // });
        // if (!response.ok)
        //   throw new Error(
        //     `${method} request to ${url} failed with ${response.status}`,
        //   );
        // return await response.json();
    }

};

// Modify the request handlers to send responses back to the main thread
self.onmessage = async (e: MessageEvent<ApiMessageData<any>>) => {
  const { id, type, endpoint, data } = e.data;

  try {
    let result;
    switch (type) {
      case 'GET':
        // @ts-expect-error TODO type definition
        result = await doGetRequest( endpoint, data);
        break;
      case 'POST': case 'PUT': case 'DELETE':
        // @ts-expect-error TODO type definition
        result = await doWriteRequest(type, endpoint, data);
        break;
      default:
        throw new Error(`Unsupported request type: ${type}`);
    }

    self.postMessage({ id, success: true, data: result });
  } catch (error) {
    console.error("error", error);
    self.postMessage({
      id,
      success: false,
      error: (error as Error).message,
    });
  }
};
