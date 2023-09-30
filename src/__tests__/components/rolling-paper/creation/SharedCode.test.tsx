import {render, screen, fireEvent} from "@testing-library/react"
import SharedCode from "@/components/rolling-paper/creation/SharedCode"

describe("SharedCode", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    const sharedCode = "J1234"

    render(<SharedCode sharedCode={sharedCode} handleSharedCode={jest.fn()} />)

    const description = screen.getByText("롤링페이퍼의 공유 코드를 만들까요?")
    const input = screen.getByPlaceholderText(
      "기본 코드 디폴트"
    ) as HTMLInputElement

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input.value).toBe(sharedCode)
  })

  it("인풋 값이 바뀌면 handleToWhom을 호출한다.", () => {
    // given
    const sharedCode = "J1234"
    const handleSharedCode = jest.fn()

    render(
      <SharedCode sharedCode={sharedCode} handleSharedCode={handleSharedCode} />
    )

    const inputElement = screen.getByPlaceholderText("기본 코드 디폴트")

    // when
    fireEvent.change(inputElement, {target: {value: "JK1234"}})

    // then
    expect(handleSharedCode).toHaveBeenCalledTimes(1)
  })
})
