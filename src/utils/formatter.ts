import {ONE_DAY} from "@/constants/date"

export function calculateRemainingDay(
  target: string,
  current: string = new Date().toString()
): number {
  const targetDate = new Date(target)
  const currentDate = new Date(current)

  const timeDifferenceMs = targetDate.getTime() - currentDate.getTime()
  const remainingDay = Math.ceil(timeDifferenceMs / ONE_DAY)

  return remainingDay
}

export function formatDateTime(
  date: Date,
  isWithTime: boolean = false,
  {
    hours,
    minutes,
    seconds,
  }: {
    hours?: number
    minutes?: number
    seconds?: number
  } = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")

  if (isWithTime) {
    const hour = String(hours ?? date.getUTCHours()).padStart(2, "0")
    const minute = String(minutes ?? date.getUTCMinutes()).padStart(2, "0")
    const second = String(seconds ?? date.getUTCSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  return `${year}-${month}-${day}`
}
