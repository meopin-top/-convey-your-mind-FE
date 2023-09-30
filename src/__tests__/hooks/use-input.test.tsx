import {render, fireEvent, screen} from "@testing-library/react"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"

function renderTestComponent(callback?: (event: TInputChangeEvent) => any) {
  const TestComponent = () => {
    const [value, handleValue] = useInput("", callback)

    return <input data-testid="input" value={value} onChange={handleValue} />
  }

  render(<TestComponent />)
}

describe("useInput", () => {
  test("값이 올바르게 업데이트되고, 콜백 함수가 호출된다.", () => {
    // given
    const value = "test"
    const setInputValue = jest.fn()

    renderTestComponent(setInputValue)

    const input = screen.getByTestId("input") as HTMLInputElement

    // when
    fireEvent.change(input, {target: {value}})

    // then
    expect(setInputValue).toBeCalled()
    expect(input.value).toEqual(value)
  })

  test("값이 올바르게 업데이트되고, 콜백 함수가 호출되지 않는다.", () => {
    // given
    const value = "test"

    renderTestComponent()

    const input = screen.getByTestId("input") as HTMLInputElement

    // when
    fireEvent.change(input, {target: {value}})

    // then
    expect(input.value).toEqual(value)
  })
})
