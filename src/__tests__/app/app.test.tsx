import {render, screen} from "@testing-library/react"
import Home from "@/app/page"

const withOutSignUpId = "without-sign-up"
const withSignUpId = "with-sign-up"
const withOauthId = "with-oauth"

jest.mock("../../components/app/WithoutSignUp.tsx", () => ({
  __esModule: true,
  default: () => (
    <div data-testid={withOutSignUpId}>WithoutSignUp Component</div>
  ),
}))
jest.mock("../../components/app/WithSignUp.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid={withSignUpId}>WithSignUp Component</div>,
}))
jest.mock("../../components/app/WithOauth.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid={withOauthId}>WithOauth Component</div>,
}))
jest.mock("../../components/LoginChecker.tsx", () => ({
  __esModule: true,
  NeedNotLoggedIn: () => <></>,
}))

describe("Home", () => {
  it("헤더 내용과 컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<Home />)

    const slogan = screen.getByAltText("슬로건")
    const subtitle = screen.getByText(
      "subtitle 영역, 최대 2줄 정도 소개 문구? 느낌으로 넣으면 좋을듯!"
    )
    const withoutSignUp = screen.getByTestId(withOutSignUpId)
    const withSignUp = screen.getByTestId(withSignUpId)
    const withOauth = screen.getByTestId(withOauthId)

    // then
    expect(slogan).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
    expect(withoutSignUp).toBeInTheDocument()
    expect(withSignUp).toBeInTheDocument()
    expect(withOauth).toBeInTheDocument()
  })
})
