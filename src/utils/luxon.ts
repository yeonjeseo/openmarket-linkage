import { DateTime } from 'luxon';

export const startOfToday = () =>
  DateTime.local().setLocale('ko').setZone('UTC').startOf('day').toISO();
