// @flow
import roundDecimal from './roundDecimal';

// TODO: improve this to check whether the object contains not only string, but also array of string
export default function convertObjectValueToNumber(
  object: {[key: string]: any},
  keys: Array<string>,
  fixed?: number = 1
): Object {
  let newObject = {};
  keys.forEach((key) => {
    newObject[key] = roundDecimal(object[key], fixed);
  });
  return {
    ...object,
    ...newObject,
  };
}
