import {render, screen, fireEvent} from "@testing-library/react"
import EmailInput from "@/components/account-inquiry/EmailInput"

describe("EmailInput", () => {
  // TODO: 중요한 문구면 렌더링 테스트에 추가한다

  it("인풋과 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")
    const inquiryButton = screen.getByRole("button")

    // then
    expect(emailInput).toBeInTheDocument()
    expect(inquiryButton).toBeInTheDocument()
  })

  it("예비 이메일이 올바르게 입력된다.", () => {
    // given
    const email = "test@test.com"

    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText(
      "예비 이메일 입력하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(emailInput, {
      target: {value: email},
    })

    // then
    expect(emailInput.value).toEqual(email)
  })
})
