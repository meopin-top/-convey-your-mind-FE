import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/my/setting/Content"
import {
  UserIdProvider,
  ProfileProvider,
  NicknameProvider,
  EmailProvider,
  PasswordProvider
} from "@/components/my/setting/Context"
import {Reducer} from "@/components"
import type {TProps as TPortalProps} from "@/components/Portal"
import {AUTH} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"
import {createLocalStorageMock, removeLocalStorageMock} from "@/__mocks__/window"

const Content = () => {
  return (
    <Reducer components={[UserIdProvider, PasswordProvider, ProfileProvider, NicknameProvider, EmailProvider]}>
      <Component />
    </Reducer>
  )
}

const USER_ID = "userId"
const PASSWORD = "password"
const PROFILE = "profile"
const NICKNAME = "nickname"
const EMAIL = "email"

const requestMock = jest.fn()
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false
  })
}))
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn()
}))
jest.mock("../../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <>Loading...</>
}))
jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>
}))
jest.mock("../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting, onClose}: {isAlerting: boolean, onClose: () => void}) => (
    <>
      ErrorAlert {isAlerting ? "open" : "close"}
      <button onClick={onClose}>확인</button>
    </>
  )
}))
jest.mock("../../../../components/my/setting/UserId.tsx", () => ({
  __esModule: true,
  default: () => <>{USER_ID}</>
}))
jest.mock("../../../../components/my/setting/Password.tsx", () => ({
  __esModule: true,
  default: () => <>{PASSWORD}</>
}))
jest.mock("../../../../components/my/setting/Profile.tsx", () => ({
  __esModule: true,
  default: () => <>{PROFILE}</>
}))
jest.mock("../../../../components/my/setting/Nickname.tsx", () => ({
  __esModule: true,
  default: () => <>{NICKNAME}</>
}))
jest.mock("../../../../components/my/setting/Email.tsx", () => ({
  __esModule: true,
  default: () => <>{EMAIL}</>
}))

describe("Content", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterAll(() => {
    removeLocalStorageMock()
  })

  it("API 호출 시 에러가 없으면 부제목과 컴포넌트를 올바르게 렌더링한다.", async () => {
    // given, when
    requestMock.mockResolvedValue({
      code: AUTH.USER.GET_DATA_SUCCESS,
      data: {
        id: "userId",
        nickName: "nickname",
        email: "email@domain.com"
      }
    })

    await waitFor(() => {
      render(<Content />)
    })

    const subtitle1 = screen.getByText("로그인 정보")
    const userId = screen.getByText(new RegExp(USER_ID))
    const password = screen.getByText(new RegExp(PASSWORD))
    const subtitle2 = screen.getByText("계정 정보")
    const profile = screen.getByText(new RegExp(PROFILE))
    const nickname = screen.getByText(new RegExp(NICKNAME))
    const email = screen.getByText(new RegExp(EMAIL))
    const errorAlert = screen.queryByText("ErrorAlert open")

    // then
    expect(subtitle1).toBeInTheDocument()
    expect(userId).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(subtitle2).toBeInTheDocument()
    expect(profile).toBeInTheDocument()
    expect(nickname).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(errorAlert).not.toBeInTheDocument()
  })

  it("API 호출 시 에러가 발생하면 ErrorAlert 컴포넌트를 렌더링한다.", async () => {
    // given, when
    requestMock.mockResolvedValue({
      code: -1,
      data: {
        id: "userId",
        nickName: "nickname",
        email: "email@domain.com"
      }
    })

    await waitFor(() => {
      render(<Content />)
    })

    const errorAlert = screen.getByText(/ErrorAlert open/)

    // then
    expect(errorAlert).toBeInTheDocument()
  })

  it("API 호출 에러가 발생할 때 '확인' 버튼을 누르면 마이 페이지로 리다이렉트된다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock
    })
    requestMock.mockResolvedValue({
      code: -1,
      data: {
        id: "userId",
        nickName: "nickname",
        email: "email@domain.com"
      }
    })

    await waitFor(() => {
      render(<Content />)
    })

    const okButton = screen.getByRole("button", {name: "확인"})

    // when
    fireEvent.click(okButton)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })
})
