// @flow

const MAX_LENGTH = 21;

export default function splitLongLabel(label: string, maxLength?: number): Array<string> {
  let words = label.split(' ').reverse();
  let result = [];
  let line = '';
  while (words.length > 0) {
    let newWord = words.pop();
    if (line.length === 0) {
      line = newWord;
    } else if (line.length + newWord.length + 1 > (maxLength || MAX_LENGTH)) {
      result.push(line);
      line = newWord;
    } else {
      line += ` ${newWord}`;
    }
  }
  if (line.length !== 0) {
    result.push(line);
  }
  return result;
}
