import {debounce} from "@/utils/optimization"

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("delay 내에 함수가 여러 번 호출되어도 1번만 실행되어야 한다.", () => {
    // given
    const mockFunction = jest.fn()
    const delayedFunction = debounce(mockFunction, 1000)

    // when
    delayedFunction()
    delayedFunction()
    delayedFunction()

    jest.runAllTimers()

    // then
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })

  it("delay된 함수가 호출되자마자 실행되는 것이 아니라 일정 시간이 지난 뒤에 호출되어야 한다.", () => {
    // given
    const mockFunction = jest.fn()
    const delayedFunction = debounce(mockFunction, 100)

    delayedFunction()

    // when
    jest.advanceTimersByTime(50)

    // then
    expect(mockFunction).not.toHaveBeenCalled()

    // when
    jest.advanceTimersByTime(50)

    // then
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })
})
