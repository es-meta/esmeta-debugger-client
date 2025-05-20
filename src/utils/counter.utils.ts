function* ascendingGenerator() {
  let count = 0;
  while (true) {
    count += 1;
    if (count === Number.MAX_SAFE_INTEGER) {
      count = 0;
    }
    yield count;
  }
}

export function createIdGenerator() {
  const gen = ascendingGenerator();
  return () => gen.next().value;
}
