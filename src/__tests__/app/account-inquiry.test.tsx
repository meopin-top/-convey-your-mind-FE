import {render, screen} from "@testing-library/react"
import AccountInquiry from "@/app/account-inquiry/page"

jest.mock("../../components/account-inquiry", () => ({
  __esModule: true,
  EmailInput: () => <div data-testid="email-input">EmailInput Component</div>,
  CustomerService: () => (
    <div data-testid="customer-service">CustomerService Component</div>
  ),
}))

describe("AccountInquiry", () => {
  it("헤더 내용과 컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<AccountInquiry />)

    const slogan = screen.getByAltText("슬로건")
    const EmailInput = screen.getByTestId("email-input")
    const CustomerService = screen.getByTestId("customer-service")

    // then
    expect(slogan).toBeInTheDocument()
    expect(EmailInput).toBeInTheDocument()
    expect(CustomerService).toBeInTheDocument()
  })
})
