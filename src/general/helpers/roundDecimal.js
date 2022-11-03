// @flow

const DEFAULT_FIXED_NUMBER = 1;

export default function roundDecimal(
  decimal: number | string,
  fixed?: number = DEFAULT_FIXED_NUMBER
) {
  let number = Number(decimal);
  if (isNaN(number)) {
    return decimal;
  }
  return Number(number.toFixed(fixed));
}
