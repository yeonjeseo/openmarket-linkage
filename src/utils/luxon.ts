import { DateTime } from 'luxon';

// export const startOfToday = () =>
// DateTime.local().setLocale('ko').setZone('UTC').startOf('day').toISO();

export const startOfToday = () =>
  DateTime.local().setLocale('ko').plus({ minute: -10 }).setZone('UTC').toISO();

// export const endOfToday = () =>
//   DateTime.local().setLocale('ko').setZone('UTC').endOf('day').toISO();

export const endOfToday = () =>
  DateTime.local().setLocale('ko').plus({ minute: 10 }).setZone('UTC').toISO();

export const someDay = () =>
  DateTime.local().setLocale('ko').plus({ day: -10 }).setZone('UTC').toISO();
