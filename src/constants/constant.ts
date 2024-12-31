// export const Link = ["jseditor", "specviewer"];

export const IS_DEBUG = process.env.NODE_ENV === "development";

export const QUERY_PROG = "prog";
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