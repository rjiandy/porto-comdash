// @flow

import roundDecimal from './roundDecimal';

type FormatedOutput = {
  name: string;
  value: number;
};

type Output = Array<FormatedOutput>;

type Key = {
  from: string;
  to: string;
};

export default function formatChartInput(
  data: Object,
  keys: Array<Key>
): Output {
  return keys.map((key) => {
    let {from: originalKey, to: targetKey} = key;
    let value = Number(roundDecimal(data[originalKey]));
    if (isNaN(value)) {
      value = 0;
    }
    return {name: targetKey, value};
  });
}
