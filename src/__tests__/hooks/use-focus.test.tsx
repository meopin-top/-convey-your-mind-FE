import {render, screen, fireEvent} from "@testing-library/react"
import type {MutableRefObject} from "react"
import useFocus from "@/hooks/use-focus"

const keysToFocus = ["Tab", "Enter"]

const TestComponent = () => {
  const {ref, onKeyDown} = useFocus(keysToFocus)

  return (
    <>
      <input
        placeholder="기존에 포커스되는 인풋"
        onKeyDown={onKeyDown}
        autoFocus
      />
      <input
        placeholder="이후에 포커스되는 인풋"
        ref={ref as MutableRefObject<HTMLInputElement | null>}
      />
    </>
  )
}

describe("use-focus", () => {
  it("Tab 키를 누르면 두 번째 인풋에 포커스가 된다.", () => {
    // given
    render(<TestComponent />)

    const focusedInput = screen.getByPlaceholderText("기존에 포커스되는 인풋")
    const inputToBeFocused =
      screen.getByPlaceholderText("이후에 포커스되는 인풋")

    // when
    fireEvent.keyDown(focusedInput, {key: "Tab"})

    // then
    expect(document.activeElement).not.toEqual(focusedInput)
    expect(document.activeElement).toEqual(inputToBeFocused)
  })

  it("Enter 키를 누르면 두 번째 인풋에 포커스가 된다.", () => {
    // given
    render(<TestComponent />)

    const focusedInput = screen.getByPlaceholderText("기존에 포커스되는 인풋")
    const inputToBeFocused =
      screen.getByPlaceholderText("이후에 포커스되는 인풋")

    // when
    fireEvent.keyDown(focusedInput, {key: "Enter"})

    // then
    expect(document.activeElement).not.toEqual(focusedInput)
    expect(document.activeElement).toEqual(inputToBeFocused)
  })
})
