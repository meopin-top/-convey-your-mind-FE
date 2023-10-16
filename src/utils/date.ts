import {ONE_DAY} from "@/constants/date"

export function calculateDateOffset(offset: number): Date {
  const now = new Date()
  const offsetDate = new Date(now.getTime() + offset * ONE_DAY)

  offsetDate.setUTCHours(0, 0, 0, 0)

  return offsetDate
}

export function calculateDDay(targetDate: Date): number {
  const now = new Date()
  const timeDiff = targetDate.getTime() - now.getTime()
  const days = Math.ceil(timeDiff / ONE_DAY)

  return days
}

export function isBefore(target: Date, comparable: Date): boolean {
  return target.getTime() < comparable.getTime()
}
