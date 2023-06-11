export function compose(
  ...functions: ((...arguments_: any[]) => any)[]
): (...arguments_: any[]) => any {
  return function (...arguments_: any[]): any {
    return functions.reduce(
      (result, function_) => function_(result),
      arguments_
    )
  }
}
