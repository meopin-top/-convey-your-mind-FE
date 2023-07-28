import {render, screen} from "@testing-library/react"
import CustomerService from "@/components/account-inquiry/CustomerService"

describe("CustomerService", () => {
  it("버튼과 텍스트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<CustomerService />)

    const guideText = screen.getByText(/예비 이메일을 입력하지 않으셨나요?/)
    const toCustomerServiceButton = screen.getByRole("button")

    // then
    expect(guideText).toBeInTheDocument()
    expect(toCustomerServiceButton).toBeInTheDocument()
  })
})
