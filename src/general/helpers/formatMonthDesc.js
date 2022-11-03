// @flow

export default function formatMonthDesc(monthDesc: string): string {
  return monthDesc.split('-').reverse().join('-');
}
