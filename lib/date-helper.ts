// tslint:disable
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export type MONTHS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export const NEW_YORK_ZONE = 'America/New_York'

const TRADING_END_HOUR_NEW_YORK = 16
const TRADING_END_MINUTES_NEW_YORK = 0
const TRADING_START_HOUR_NEW_YORK = 9
const TRADING_START_MINUTES_NEW_YORK = 30

export default class DateHelper {
  private dateTime: dayjs.Dayjs

  constructor(date = new Date()) {
    this.dateTime = dayjs.tz(date, NEW_YORK_ZONE)
  }

  toDate(): Date {
    return this.dateTime.toDate()
  }

  setYearMonthDay(year: number, month: MONTHS, day: number): this {
    this.dateTime = this.dateTime.set('year', year).set('month', month - 1).set('date', day)
    return this
  }

  setTime(hours: number, minute: number, second = 0, millisecond = 0): this {
    this.dateTime = this.dateTime.set('hour', hours)
      .set('minute', minute)
      .set('second', second)
      .set('millisecond', millisecond)
    return this
  }

  toStartOfTradingTime(): this {
    return this.setTime(TRADING_START_HOUR_NEW_YORK, TRADING_START_MINUTES_NEW_YORK)
  }

  toEndOfTradingTime(): this {
    return this.setTime(TRADING_END_HOUR_NEW_YORK, TRADING_END_MINUTES_NEW_YORK)
  }
}
