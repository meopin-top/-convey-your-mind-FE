import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/app/SignIn"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import Context from "@/store/sign-in"
import type {TProps as TPortalProps} from "@/components/Portal"
import {SIGN_IN} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"
import {createLocalStorageMock} from "@/__mocks__/window"
import type {TRoute, TTab} from "@/@types/sign-in"

const redirectTo = "/test" as TRoute
const setRedirectToMock = jest.fn()
const context = {
  tab: "signIn" as TTab,
  setTab: jest.fn(),
  redirectTo,
  setRedirectTo: setRedirectToMock,
}

const SignIn = () => {
  return (
    <Context.Provider value={context}>
      <Component />
    </Context.Provider>
  )
}

const isLoading = false

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../components/SecretInput.tsx", () => ({
  __esModule: true,
  default: ({...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" {...props} />
  ),
}))
jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <>loading</>,
}))
jest.mock("../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))

const requestMock = jest.fn()
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading,
  }),
}))

describe("SignIn", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
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

  it("로그인하기 버튼 disabled 상태는 isLoading 상태와 동일하다.", () => {
    // given, when
    render(<SignIn />)

    const signInButton = screen.getByRole("button", {
      name: "로그인하기",
    })

    // then
    expect(signInButton).not.toBeDisabled()
  })

  it("로딩 컴포넌트 렌더링 상태는 isLoading 상태와 동일하다.", () => {
    // given, when
    render(<SignIn />)

    const loading = screen.queryByText("loading")

    // then
    expect(loading).not.toBeInTheDocument()
  })

  it("로그인을 시도하면 request가 호출된다.", async () => {
    // given
    const message = "로그인 시도"

    requestMock.mockResolvedValueOnce({
      message,
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
    const userId = "userId"
    const password = "password"

    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    // then
    await waitFor(() => {
      expect(requestMock).toHaveBeenCalledTimes(1)
    })
  })

  it("로그인 인증에 실패하면 ErrorAlert가 호출된다.", async () => {
    // given
    const message = "로그인 시도"

    requestMock.mockResolvedValueOnce({
      message,
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
    const userId = "userId"
    const password = "password"

    fireEvent.change(userIdInput, {target: {value: userId}})
    fireEvent.change(passwordInput, {target: {value: password}})
    fireEvent.click(signInButton)

    const errorAlert = await screen.findByText(/ErrorAlert open/)

    // then
    expect(errorAlert).toBeInTheDocument()
  })

  it("로그인 인증에 성공하면 Storage에 닉네임과 프로필이 저장된다.", async () => {
    // given
    const nickName = "nickName"
    const profile = "https://profile.com"
    const userId = "userId"
    const password = "password"

    requestMock.mockResolvedValueOnce({
      code: SIGN_IN.SUCCESS,
      message: "로그인 성공",
      data: {
        nickName,
        profile,
      },
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
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
    })
  })

  it("로그인 인증에 성공하면 context 값에 따라 redirect되고, context 값을 MY_PAGE로 변경한다.", async () => {
    // given
    const nickName = "nickName"
    const profile = "https://profile.com"
    const userId = "userId"
    const password = "password"

    requestMock.mockResolvedValueOnce({
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
      expect(routerPushMock).toHaveBeenCalledTimes(1)
      expect(routerPushMock).toHaveBeenCalledWith(redirectTo)
      expect(setRedirectToMock).toHaveBeenCalledTimes(1)
      expect(setRedirectToMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
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
