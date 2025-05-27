// TODO remove when safari supports it
export const requestIdleCallback =
  window.requestIdleCallback ||
  function (cb: () => void) {
    return setTimeout(function () {
      cb();
    }, 0);
  };
