import {render, screen} from "@testing-library/react"
import Home from "@/app/page"

jest.mock("../../components/app", () => ({
  WithoutSignUp: jest.fn(() => (
    <div data-testid="without-signup">WithoutSignUp Component</div>
  )),
  WithSignUp: jest.fn(() => (
    <div data-testid="with-signup">WithSignUp Component</div>
  )),
  WithOauth: jest.fn(() => (
    <div data-testid="with-oauth">WithOauth Component</div>
  )),
}))

describe("Home", () => {
  it("헤더 내용과 컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<Home />)
    const slogan = screen.getByAltText("슬로건")
    const subtitle = screen.getByText(
      "subtitle 영역, 최대 2줄 정도 소개 문구? 느낌으로 넣으면 좋을듯!"
    )
    const withoutSignup = screen.getByTestId("without-signup")
    const withSignup = screen.getByTestId("with-signup")
    const withOauth = screen.getByTestId("with-oauth")

    // then
    expect(slogan).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
    expect(withoutSignup).toBeInTheDocument()
    expect(withSignup).toBeInTheDocument()
    expect(withOauth).toBeInTheDocument()
  })
})
