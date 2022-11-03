// @flow

export default function splitArray<T: *>(
  array: Array<T>,
  maximumLength: number
): Array<Array<T>> {
  let originalArray = [...array];
  let splittedArray = [];
  while (originalArray.length) {
    splittedArray.push(originalArray.splice(0, maximumLength));
  }
  return splittedArray;
}
