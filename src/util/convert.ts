export function parseStep(value: string, depth: number): number {
  switch (depth % 3) {
    case 0:
      return parseInt(value, 10);
    case 1:
      return AlphabetToNumber(value);
    case 2:
      return RomanToNumber(value);
    default:
      throw new Error("Invalid depth");
  }
}

function AlphabetToNumber(letter: string): number {
  const baseCharCode = "a".charCodeAt(0);
  return letter.charCodeAt(0) - baseCharCode + 1;
}

function RomanToNumber(roman: string): number {
  const romanMapping = new Map<string, number>([
    ["m", 1000],
    ["cm", 900],
    ["d", 500],
    ["cd", 400],
    ["c", 100],
    ["xc", 90],
    ["l", 50],
    ["xl", 40],
    ["x", 10],
    ["ix", 9],
    ["v", 5],
    ["iv", 4],
    ["i", 1],
  ]);

  let index = 0;
  let num = 0;

  while (index < roman.length) {
    if (
      index + 1 < roman.length &&
      romanMapping.has(roman.substring(index, index + 2))
    ) {
      num += romanMapping.get(roman.substring(index, index + 2))!;
      index += 2;
    } else {
      num += romanMapping.get(roman[index])!;
      index += 1;
    }
  }

  return num;
}
