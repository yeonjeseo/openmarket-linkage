import { DateTime } from 'luxon';

export const startOfToday = () =>
  DateTime.local()
    .setLocale('ko')
    .plus({ day: -1 })
    .setZone('UTC')
    .startOf('day')
    .toISO();

export const endOfToday = () =>
  DateTime.local()
    .setLocale('ko')
    .plus({ day: -1 })
    .setZone('UTC')
    .endOf('day')
    .toISO();
