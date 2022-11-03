// @flow

const SECOND_IN_MILISECONDS = 1000;
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_MINUTES = 60;
const DAY_IN_HOURS = 24;

export default function getTimeInterval(
  timeOne: Date,
  timeTwo?: Date = new Date(),
) {
  let laterTime = timeTwo.getTime();
  let earlierTime = timeOne.getTime();
  let minuteInterval = Number(
    ((laterTime - earlierTime) /
      SECOND_IN_MILISECONDS /
      MINUTE_IN_SECONDS
    ).toFixed(),
  );
  if (minuteInterval < 60) {
    return {interval: minuteInterval, timeUnit: 'minute'};
  }

  let hourInterval = Number((minuteInterval / HOUR_IN_MINUTES).toFixed());
  if (hourInterval < 24) {
    return {interval: hourInterval, timeUnit: 'hour'};
  }

  let dayInterval = Number((hourInterval / DAY_IN_HOURS).toFixed());
  return {interval: dayInterval, timeUnit: 'day'};
}
