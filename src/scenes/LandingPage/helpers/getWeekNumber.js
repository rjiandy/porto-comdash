// @flow

export default function getWeekNumber(weekID: string) {
  return Number(weekID.substr(4));
}
