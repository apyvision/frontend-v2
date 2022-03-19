import { sub } from 'date-fns';

export const oneSecondInMs = 1000;
export const oneMinInMs = 60 * oneSecondInMs;
export const oneHourInMs = 60 * oneMinInMs;

export const twentyFourHoursInMs = 24 * oneHourInMs;
export const twentyFourHoursInSecs = twentyFourHoursInMs / oneSecondInMs;

export const timeNowInMs = Math.floor(Date.now() / oneSecondInMs);

export const oneYearInSecs = twentyFourHoursInSecs * 365;

export function dateTimeLabelFor(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZoneName: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function toJsTimestamp(unixTimestamp: number): number {
  return unixTimestamp * oneSecondInMs;
}

export function getPreviousThursday(date: Date): Date {
  let daysSinceThursday = date.getDay() - 4;
  if (daysSinceThursday < 0) daysSinceThursday += 7;

  return sub(date, {
    days: daysSinceThursday,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  });
}

export default function useTime() {
  return {
    oneSecondInMs,
    oneMinInMs,
    oneHourInMs,
    twentyFourHoursInMs,
    twentyFourHoursInSecs,
    // methods
    dateTimeLabelFor
  };
}
