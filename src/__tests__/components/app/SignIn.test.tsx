import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import SignIn from "@/components/app/SignIn"
import type {TProps} from "@/components/SecretInput"
import {post} from "@/api"
import Storage from "@/store/local-storage"
import {SIGN_IN} from "@/constants/response-code"

jest.mock("../../../components", () => ({
  __esModule: true,
  SecretInput: ({inputRef, ...props}: Omit<TProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
}))

jest.mock("../../../api", () => ({
  post: jest.fn(),
}))

describe("SignIn", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
  })

  it("유저 아이디가 올바르게 변경된다.", () => {
    // given
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(userIdInput, {target: {value}})

    // then
    expect(userIdInput.value).toEqual(value)
  })

  it("유저 비밀번호가 올바르게 변경된다.", () => {
    // given
    render(<SignIn />)

    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(passwordInput, {target: {value}})

    // then
    expect(passwordInput.value).toEqual(value)
  })

  it("로그인을 시도하면 post가 호출되고, 로그인 성공 유무와 상관 없이 alert가 호출된다.", async () => {
    // given
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const signInButton = screen.getByText("로그인")

    const message = "로그인 시도"
    const userId = "userId"
    const password = "password"

    ;(post as jest.Mock).mockResolvedValueOnce({
      message,
    })

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
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const signInButton = screen.getByText("로그인")

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

  it("'내 계정 정보 찾기'를 누르면 라우팅이 변경된다.", () => {
    // given, when
    render(<SignIn />)

    const myAccountLink = screen.getByText(
      "내 계정 정보 찾기"
    ) as HTMLAnchorElement

    // then
    expect(myAccountLink.href).toEqual("http://localhost/#")
  })
})
