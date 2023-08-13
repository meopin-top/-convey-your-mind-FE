import {render, screen, fireEvent} from "@testing-library/react"
import RollingPaperParticipation from "@/components/my/RollingPaperParticipation"

describe("RollingPaperParticipation", () => {
  it("인풋과 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<RollingPaperParticipation />)

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // then
    expect(sharedCodeInput).toBeInTheDocument()
    expect(participationButton).toBeInTheDocument()
  })

  it("공유코드 state를 올바르게 변경한다.", () => {
    // given
    render(<RollingPaperParticipation />)

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(sharedCodeInput, {target: {value}})

    // then
    expect(sharedCodeInput.value).toEqual(value)
  })
})
