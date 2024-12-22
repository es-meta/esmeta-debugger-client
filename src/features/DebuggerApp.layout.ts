const lgLayout = [
  { i: "jsedi", x: 0, y: 0, w: 2, h: 5 },
  { i: "specv", x: 2, y: 0, w: 2, h: 5 },
  { i: "calls", x: 4, y: 0, w: 2, h: 1 },
  { i: "envir", x: 4, y: 1, w: 2, h: 1 },
  { i: "heapv", x: 4, y: 2, w: 2, h: 1 },
  { i: "break", x: 4, y: 3, w: 2, h: 1 },
];

const mdLayout = [
  { i: "jsedi", x: 0, y: 0, w: 2, h: 4 },
  { i: "specv", x: 0, y: 4, w: 2, h: 4 },
  { i: "calls", x: 2, y: 0, w: 2, h: 1 },
  { i: "envir", x: 2, y: 1, w: 2, h: 1 },
  { i: "heapv", x: 2, y: 2, w: 2, h: 1 },
  { i: "break", x: 2, y: 3, w: 2, h: 1 },
];

const smLayout = [
  { i: "jsedi", x: 0, y: 0, w: 1, h: 3 },
  { i: "specv", x: 1, y: 0, w: 1, h: 3 },
  { i: "calls", x: 2, y: 0, w: 1, h: 1 },
  { i: "envir", x: 3, y: 0, w: 1, h: 1 },
  { i: "heapv", x: 4, y: 0, w: 1, h: 1 },
  { i: "break", x: 5, y: 0, w: 1, h: 1 },
];

const xsLayout = [
  { i: "jsedi", x: 0, y: 0, w: 1, h: 2 },
  { i: "specv", x: 1, y: 0, w: 1, h: 2 },
  { i: "calls", x: 2, y: 0, w: 1, h: 1 },
  { i: "envir", x: 3, y: 0, w: 1, h: 1 },
  { i: "heapv", x: 4, y: 0, w: 1, h: 1 },
  { i: "break", x: 5, y: 0, w: 1, h: 1 },
];

const xxsLayout = [
  { i: "jsedi", x: 0, y: 0, w: 1, h: 1 },
  { i: "specv", x: 1, y: 0, w: 1, h: 1 },
  { i: "calls", x: 2, y: 0, w: 1, h: 1 },
  { i: "envir", x: 3, y: 0, w: 1, h: 1 },
  { i: "heapv", x: 4, y: 0, w: 1, h: 1 },
  { i: "break", x: 5, y: 0, w: 1, h: 1 },
];

export const layouts = {
  lg: lgLayout,
  md: mdLayout,
  sm: smLayout,
  xs: xsLayout,
  xxs: xxsLayout,
};
