import {render, screen, fireEvent} from "@testing-library/react"
import SharingCode from "@/components/rolling-paper/creation/SharingCode"

describe("SharingCode", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    const sharingCode = "J1234"

    render(
      <SharingCode sharingCode={sharingCode} handleSharingCode={jest.fn()} />
    )

    const description = screen.getByText("롤링페이퍼의 공유 코드를 만들까요?")
    const input = screen.getByPlaceholderText(
      "기본 코드 디폴트"
    ) as HTMLInputElement

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input.value).toBe(sharingCode)
  })

  it("인풋 값이 바뀌면 handleSharingCode을 호출한다.", () => {
    // given
    const sharingCode = "J1234"
    const handleSharingCode = jest.fn()

    render(
      <SharingCode
        sharingCode={sharingCode}
        handleSharingCode={handleSharingCode}
      />
    )

    const inputElement = screen.getByPlaceholderText("기본 코드 디폴트")

    // when
    fireEvent.change(inputElement, {target: {value: "JK1234"}})

    // then
    expect(handleSharingCode).toHaveBeenCalledTimes(1)
  })
})
