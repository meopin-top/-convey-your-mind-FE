import {compose} from "@/utils/function"

describe("compose", () => {
  it("입력으로 받은 함수를 왼쪽부터 차례대로 실행해야 한다.", () => {
    // given
    const consoleSpy: jest.MockInstance<void, any> = jest
      .spyOn(console, "log")
      .mockImplementation(() => {})

    function function1() {
      console.log("function1 실행")
    }

    function function2() {
      console.log("function2 실행")
    }

    function function3() {
      console.log("function3 실행")
    }

    const composedFunction = compose(function1, function2, function3)

    // when
    composedFunction()

    // then
    expect(consoleSpy.mock.calls[0][0]).toBe("function1 실행")
    expect(consoleSpy.mock.calls[1][0]).toBe("function2 실행")
    expect(consoleSpy.mock.calls[2][0]).toBe("function3 실행")

    consoleSpy.mockRestore()
  })

  it("실행한 함수의 return 값이 다음 함수의 입력값이 되어야 한다.", () => {
    // given, when
    function add(x: number, amount: number): number {
      return x + amount
    }

    function double(x: number): number {
      return x * 2
    }

    function minus(x: number, amount: number): number {
      return x - amount
    }

    const composedFunction = compose(
      () => add(2, 2),
      double,
      (x) => minus(x, 1)
    )

    // then
    expect(composedFunction()).toEqual(7)
  })
})
