function toAlpha(num: number): string {
  return String.fromCharCode(65 + num - 1);
}

function toRoman(num: number): string {
  const roman = [
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
    ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
    ["", "M", "MM", "MMM", "MMMM"],
  ];

  const digits = num.toString().split("").reverse();
  let romanNum = "";
  for (let i = 0; i < digits.length; i++) {
    romanNum = roman[i][Number(digits[i])] + romanNum;
  }
  return romanNum;
}

export function toStepString(steps: number[]) {
  let str = "";
  for (let i = 0; i < steps.length; i++) {
    switch (i % 3) {
      case 0:
        str += steps[i];
        break;
      case 1:
        str += toAlpha(steps[i]);
        break;
      case 2:
        str += toRoman(steps[i]);
        break;
    }
    if (i !== steps.length - 1) str += ".";
  }
  return str;
}
