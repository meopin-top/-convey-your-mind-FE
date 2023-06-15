import {render, fireEvent, screen, waitFor} from "@testing-library/react"
import Home from "@/app/poc-api/page"
import {post} from "@/api"

jest.mock("../../api/index.ts", () => ({
  post: jest.fn(() => ({
    message: "success",
  })),
}))

describe("Home", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
  })

  test("회원가입 버튼 클릭 시 input에 입력된 값들과 함께 post가 호출된다.", async () => {
    // given
    render(<Home />)

    const idInput = screen.getByPlaceholderText("아이디")
    const passwordInput = screen.getByPlaceholderText("비밀번호")
    const signupButton = screen.getByText("회원가입 버튼")

    fireEvent.change(idInput, {
      target: {value: "testuser"},
    })
    fireEvent.change(passwordInput, {
      target: {value: "testpassword"},
    })

    // when
    fireEvent.click(signupButton)

    // then
    await waitFor(() => expect(windowAlertMock).toHaveBeenCalled())
    expect(post).toHaveBeenCalledWith("/users/sign-up", {
      userId: "testuser",
      nickName: "testuser",
      password: "testpassword",
      passwordCheck: "testpassword",
    })
  })

  test("로그인 버튼 클릭 시 input에 입력된 값들과 함께 post가 호출된다.", async () => {
    // given
    render(<Home />)

    const idInput = screen.getByPlaceholderText("아이디")
    const passwordInput = screen.getByPlaceholderText("비밀번호")
    const signInButton = screen.getByText("로그인 버튼")

    fireEvent.change(idInput, {
      target: {value: "testuser"},
    })
    fireEvent.change(passwordInput, {
      target: {value: "testpassword"},
    })

    // when
    fireEvent.click(signInButton)

    // then
    await waitFor(() => expect(windowAlertMock).toHaveBeenCalled())
    expect(post).toHaveBeenCalledWith("/users/sign-in", {
      userId: "testuser",
      password: "testpassword",
    })
  })
})
