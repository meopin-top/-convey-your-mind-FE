import {ONE_DAY} from "@/constants/date"

export function calculateDateOffset(offset: number, target?: Date): Date {
  const now = target ? target.getTime() : new Date().getTime()
  const offsetDate = new Date(now + offset * ONE_DAY)

  offsetDate.setUTCHours(0, 0, 0, 0)

  return offsetDate
}

// 테스트 코드 작성 불가
export function calculateDDay(targetDate: Date): number {
  const now = new Date()
  const timeDiff = targetDate.getTime() - now.getTime()

  return Math.ceil(timeDiff / ONE_DAY)
}

export function isBefore(target: Date, comparable: Date): boolean {
  return target.getTime() < comparable.getTime()
}
