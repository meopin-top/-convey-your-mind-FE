export function calculateRemainingDay(
  target: string,
  current: string = new Date().toString()
): number {
  const targetDate = new Date(target)
  const currentDate = new Date(current)

  const timeDifferenceMs = targetDate.getTime() - currentDate.getTime()
  const remainingDay = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24))

  return remainingDay
}
