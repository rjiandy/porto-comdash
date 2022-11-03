// @flow

export default function formatSnakeCaseToCapitalize(capitalString: string) {
  return capitalString
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
