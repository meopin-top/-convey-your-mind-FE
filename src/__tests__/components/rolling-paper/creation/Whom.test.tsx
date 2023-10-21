import {render, screen, fireEvent} from "@testing-library/react"
import Whom from "@/components/rolling-paper/creation/Whom"

const TO_WHOM = "test"
const handleToWhom = jest.fn()

jest.mock("react", () => ({
  __esModule: true,
  ...jest.requireActual("react"),
  useContext: () => ({
    toWhom: TO_WHOM,
    handleToWhom,
  })
}))

describe("Whom", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<Whom />)

    const description = screen.getByText("누구에게 보내는 편지인가요?")
    const input = screen.getByPlaceholderText(
      "받는 사람 이름 입력"
    ) as HTMLInputElement

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input.value).toEqual(TO_WHOM)
  })

  it("인풋 값이 바뀌면 handleToWhom을 호출한다.", () => {
    // given
    render(<Whom />)

    const inputElement = screen.getByPlaceholderText("받는 사람 이름 입력")

    // when
    fireEvent.change(inputElement, {target: {value: "test2"}})

    // then
    expect(handleToWhom).toHaveBeenCalledTimes(1)
  })
})
