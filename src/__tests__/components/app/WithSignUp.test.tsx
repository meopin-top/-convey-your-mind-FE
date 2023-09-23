import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/app/WithSignUp"
import {Provider} from "@/store/sign-up-tab"

const WithSignUp = () => {
  return (
    <Provider>
      <Component />
    </Provider>
  )
}

jest.mock("../../../components/app", () => ({
  __esModule: true,
  SignIn: () => <div>sign-in</div>,
  SignUp: () => <div>sign-up</div>,
}))

describe("WithSignUp", () => {
  it("로그인 화면을 렌더링한다.", () => {
    // given, when
    render(<WithSignUp />)

    const signInToolTip = screen.getByText(/롤링페이퍼를 새로 만들고 싶다면/)
    const signInComponent = screen.getByText("sign-in")

    // then
    expect(signInToolTip).toBeInTheDocument()
    expect(signInComponent).toBeInTheDocument()
  })

  it("회원가입 버튼을 클릭하면 회원가입 화면을 렌더링한다.", async () => {
    // given
    render(<WithSignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "회원가입",
    })

    // when
    fireEvent.click(signUpButton)

    const signUpToolTip = await screen.findByText(
      /개인정보 없이 쉽고, 빠르게 가입하기/
    )
    const signUpComponent = await screen.findByText("sign-up")

    // then
    expect(signUpToolTip).toBeInTheDocument()
    expect(signUpComponent).toBeInTheDocument()
  })

  it("회원가입 버튼을 클릭한 뒤 다시 로그인 버튼을 클릭하면 로그인 화면을 렌더링한다.", async () => {
    // given
    render(<WithSignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "회원가입",
    })
    const signInButton = screen.getByRole("button", {
      name: "로그인",
    })

    // when
    fireEvent.click(signUpButton)
    fireEvent.click(signInButton)

    const signInToolTip = await screen.findByText(
      /롤링페이퍼를 새로 만들고 싶다면/
    )
    const signInComponent = await screen.findByText("sign-in")

    // then
    expect(signInToolTip).toBeInTheDocument()
    expect(signInComponent).toBeInTheDocument()
  })
})
