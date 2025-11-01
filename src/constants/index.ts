export const HOMEPAGE_LINK_ESMETA = "https://es-meta.github.io";
export const GITHUB_LINK_ESMETA = "https://github.com/es-meta/esmeta";
export const GITHUB_LINK_ESMETA_DOCS = "https://github.com/es-meta/docs";

export const IS_DEBUG = import.meta.env.DEV;

// TODO use api to have fine grained control over the spec version
export const SPEC_URL = "https://tc39.es/ecma262/2024/";

// NOTE this is manually modeled, and should be updated when the ESMeta changes
export const EXECUTION_STACK_ADDR = "#EXECUTION_STACK";

export const USE_VERBOSE_LOG = true;

export const SEARCHPARAM_NAME_ITER = "iter";
export const SEARCHPARAM_NAME_API = "api";
export const SEARCHPARAM_NAME_PROG = "prog";

export const FALLBACK_API_URl = "http://localhost:8080";

export const FALLBACK_CODE = `var x = 1;
var y = 2;
var z = x + y;
var w = z + x;

function f () {
  let a = 42;
  g(a);
  return 0;
}

function g(a) {
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
  a = 1;
}

f();`;
