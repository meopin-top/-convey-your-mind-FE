import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import SignIn from "@/components/app/SignIn"
import type {TProps} from "@/components/SecretInput"
import {SIGN_IN} from "@/constants/response-code"
import ROUTE from "@/constants/route"
import {createLocalStorageMock, createAlertMock} from "@/__mocks__/window"

const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("../../../components", () => ({
  __esModule: true,
  SecretInput: ({inputRef, ...props}: Omit<TProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
}))

jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
  }),
}))

describe("SignIn", () => {
  beforeAll(() => {
    createAlertMock()
    createLocalStorageMock()
  })

  afterAll(() => {
    window.localStorage.clear()
  })

  it("유저 아이디 인풋, 유저 비밀번호 인풋, 로그인 버튼을 올바르게 렌더링한다", async () => {
    // given, when
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText("나의 ID 입력하기")
    const passwordInput = screen.getByPlaceholderText("나의 PW 입력하기")
    const signInButton = screen.getByRole("button", {
      name: "로그인하기",
    })

    // then
    await waitFor(() => {
      expect(userIdInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
      expect(signInButton).toBeInTheDocument()
    })
  })

  it("유저 아이디가 올바르게 변경된다.", async () => {
    // given
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(userIdInput, {target: {value}})

    // then
    await waitFor(() => {
      expect(userIdInput.value).toEqual(value)
    })
  })

  it("유저 비밀번호가 올바르게 변경된다.", async () => {
    // given
    render(<SignIn />)

    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(passwordInput, {target: {value}})

    // then
    await waitFor(() => {
      expect(passwordInput.value).toEqual(value)
    })
  })

  it("로그인을 시도하면 request가 호출되고, 로그인 성공 유무와 상관 없이 alert가 호출된다.", async () => {
    // given
    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const signInButton = screen.getByRole("button", {
      name: "로그인하기",
    })

    const message = "로그인 시도"
    const userId = "userId"
    const password = "password"

    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      message,
    })

    // when
    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(requestMock).toHaveBeenCalledTimes(1)

      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toHaveBeenCalledWith(message)
    })
  })

  it("로그인 인증에 성공하면 Storage에 닉네임과 프로필이 저장되고 redirect된다.", async () => {
    // given
    const nickName = "nickName"
    const profile = "https://profile.com"
    const userId = "userId"
    const password = "password"

    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: SIGN_IN.SUCCESS,
      message: "로그인 성공",
      data: {
        nickName,
        profile,
      },
    })
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    render(<SignIn />)

    const userIdInput = screen.getByPlaceholderText(
      "나의 ID 입력하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나의 PW 입력하기"
    ) as HTMLInputElement
    const signInButton = screen.getByRole("button", {
      name: "로그인하기",
    })

    // when
    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    // then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "nickName",
        nickName
      )
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "profile",
        profile
      )
      expect(routerPushMock).toHaveBeenCalledTimes(1)
      expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("'내 계정 정보 찾기'를 누르면 라우팅이 변경된다.", () => {
    // given, when
    render(<SignIn />)

    const myAccountLink = screen.getByText(
      "내 계정 정보 찾기"
    ) as HTMLAnchorElement

    // then
    expect(myAccountLink.href).toContain(ROUTE.ACCOUNT_INQUIRY)
  })
})
