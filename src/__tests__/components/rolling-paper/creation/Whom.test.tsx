import {render, screen, fireEvent} from "@testing-library/react"
import Whom from "@/components/rolling-paper/creation/Whom"

describe("Whom", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    const toWhom = "John Doe"
    const handleToWhom = jest.fn()

    render(<Whom toWhom={toWhom} handleToWhom={handleToWhom} />)

    const description = screen.getByText("누구에게 보내는 편지인가요?")
    const input = screen.getByPlaceholderText(
      "받는 사람 이름 입력"
    ) as HTMLInputElement

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input.value).toBe(toWhom)
  })

  it("인풋 값이 바뀌면 handleToWhom을 호출한다.", () => {
    // given
    const toWhom = "John Doe"
    const handleToWhom = jest.fn()

    render(<Whom toWhom={toWhom} handleToWhom={handleToWhom} />)

    const inputElement = screen.getByPlaceholderText("받는 사람 이름 입력")

    // when
    fireEvent.change(inputElement, {target: {value: "Jane Doe"}})

    // then
    expect(handleToWhom).toHaveBeenCalledTimes(1)
  })
})
