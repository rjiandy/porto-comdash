// @flow

export default function getStringPluralForm(word: string) {
  return word.endsWith('y')
    ? word.substr(0, word.length - 1) + 'ies'
    : word + 's';
}
