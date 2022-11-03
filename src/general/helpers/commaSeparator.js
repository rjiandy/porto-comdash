// @flow

export default function commaSeparator(
  value: number | string,
  valueArray?: Array<string>,
  decimalValue?: string,
): string {
  let array = valueArray || [];
  let stringValue;

  if (typeof value === 'number') {
    stringValue = String(value);
  } else {
    if (!value.match(/^[.\d]+$/)) {
      return value;
    }
    stringValue = value;
  }

  let [frontValue, newDecimalValue] = String(stringValue).split('.');
  newDecimalValue = newDecimalValue || decimalValue;

  if (frontValue.length > 3) {
    array.push(frontValue.substr(-3, 3));
    return commaSeparator(
      frontValue.slice(0, frontValue.length - 3),
      array,
      newDecimalValue
    );
  }

  array.push(frontValue);
  let result = array.reverse().join();
  if (newDecimalValue) {
    result = result.concat(`.${newDecimalValue}`);
  }
  return result;
}
