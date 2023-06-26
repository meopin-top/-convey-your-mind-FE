import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {post} from "@/api"
import Storage from "@/store/local-storage"
import {SIGN_IN} from "@/constants/response-code"
import WithSignUp from "@/components/app/WithSignUp"

jest.mock("../../../api", () => ({
  post: jest.fn(),
}))

describe("WithSignUp", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("유저 아이디 state를 올바르게 변경한다.", () => {
    // given
    render(<WithSignUp />)
    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(userIdInput, {target: {value}})

    // then
    expect(userIdInput.value).toEqual(value)
  })

  it("비밀번호 state를 올바르게 변경한다.", () => {
    // given
    render(<WithSignUp />)
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(passwordInput, {target: {value}})

    // then
    expect(passwordInput.value).toEqual(value)
  })

  it("로그인을 시도하면 post가 호출되고, 로그인 성공 유무와 상관 없이 alert가 호출된다.", async () => {
    // given
    const message = "로그인 시도"
    const userId = "userId"
    const password = "password"

    ;(post as jest.Mock).mockResolvedValueOnce({
      message,
    })

    render(<WithSignUp />)
    const userIdInput = screen.getByPlaceholderText("나만의 ID로 시작하기")
    const passwordInput = screen.getByPlaceholderText("나만의 PW로 시작하기")
    const signInButton = screen.getByText("로그인")

    // when
    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith("/users/sign-in", {
        userId,
        password,
      })

      expect(windowAlertMock).toBeCalledTimes(1)
      expect(windowAlertMock).toHaveBeenCalledWith(message)
    })
  })

  it("로그인 인증에 성공하면 Storage에 닉네임이 저장된다.", async () => {
    // given
    const nickName = "nickName"
    const userId = "userId"
    const password = "password"

    ;(post as jest.Mock).mockResolvedValueOnce({
      code: SIGN_IN.SUCCESS,
      message: "로그인 성공",
      data: {
        nickName,
      },
    })
    const storageSetMock = jest
      .spyOn(new Storage(), "set")
      .mockImplementation(() => {})

    render(<WithSignUp />)
    const userIdInput = screen.getByPlaceholderText("나만의 ID로 시작하기")
    const passwordInput = screen.getByPlaceholderText("나만의 PW로 시작하기")
    const signInButton = screen.getByText("로그인")

    // when
    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    // then
    await waitFor(() => {
      expect(storageSetMock).toHaveBeenCalledTimes(1)
      expect(storageSetMock).toHaveBeenCalledWith("accessToken", nickName)
    })
  })
})
