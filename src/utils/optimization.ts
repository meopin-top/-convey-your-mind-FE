export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  millisecond: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback.apply(this, args)
    }, millisecond)
  }
}
