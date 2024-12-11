import * as DateFns from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import { TZDate } from '@date-fns/tz'
import EncodeDecode from './encode-decode.server'
import { parse } from 'path'

const alphabet =
  'vwxWXyzAST5JKLMNklmnopq67hUVYZ_01OPQ89abcdefgRrstu-ij234HIFG.BCDE'

export default {
  createCountdownCode(date: string, timezone: string, title: string) {
    let parsedDate: Date | null = null
    let parsedWithUtc: UTCDate | null = null
    let parsedWithTz: TZDate | null = null
    try {
      parsedDate = DateFns.parse(date, 'yyyy-MM-dd HH:mm:ss', new Date())
    } catch (e) {
      throw new Error('Invalid date format')
    }
    try {
      parsedWithTz = new TZDate(parsedDate, timezone)
      parsedWithUtc = new UTCDate(parsedWithTz)
    } catch (e) {
      throw new Error('Invalid timezone')
    }
    const tokenString = `${parsedWithUtc.getTime()}\n${title}`
    return EncodeDecode.encode(tokenString, alphabet)
  },
  parseCountdownCode(code: string) {
    try {
      const tokenString = EncodeDecode.decode(code, alphabet)
      const [time, title] = tokenString.split('\n')
      const parsedDate = new UTCDate(parseInt(time))
      return {
        date: parsedDate,
        title
      }
    } catch (e) {
      throw new Error('Invalid code')
    }
  },
  formatCountdownDate(date: Date) {
    if (DateFns.isBefore(date, new Date())) {
      return {
        pending: false
      }
    }

    const years = DateFns.differenceInYears(date, new Date())
    const minusYears = DateFns.subYears(date, years)
    const months = DateFns.differenceInMonths(minusYears, date)
    const minusMonths = DateFns.subMonths(minusYears, months)
    const days = DateFns.differenceInDays(minusMonths, date)
    const minusDays = DateFns.subDays(minusMonths, days)
    const hours = DateFns.differenceInHours(minusDays, date)
    const minusHours = DateFns.subHours(minusDays, hours)
    const minutes = DateFns.differenceInMinutes(minusHours, date)
    const minusMinutes = DateFns.subMinutes(minusHours, minutes)
    const seconds = DateFns.differenceInSeconds(minusMinutes, date)
    return {
      pending: true,
      years: years === 0 ? undefined : years,
      months: months === 0 ? undefined : months,
      days: days === 0 ? undefined : days,
      hours: hours === 0 ? undefined : hours,
      minutes: minutes === 0 ? undefined : minutes,
      seconds: seconds === 0 ? undefined : seconds
    }
  }
}
