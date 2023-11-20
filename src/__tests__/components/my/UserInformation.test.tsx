import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/my/UserInformation"
import Store from "@/store/setting-auth"
import type {TProps as TPortalProps} from "@/components/Portal"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import {SIGN_UP} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const UserInformation = ({
  setChecked = jest.fn(),
}: {
  setChecked?: () => void
}) => {
  return (
    <Store.Provider value={{checked: false, setChecked}}>
      <Component />
    </Store.Provider>
  )
}

const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))
jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../components/SecretInput.tsx", () => ({
  __esModule: true,
  default: ({...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" {...props} />
  ),
}))
jest.mock("../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <div>loading...</div>,
}))

describe("UserInformation", () => {
  it("설정 버튼을 올바르게 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<UserInformation />)
    })

    const settingButton = screen.getByRole("button", {name: /설정/})

    // then
    expect(settingButton).toBeInTheDocument()
  })

  it("설정 버튼을 클릭하면 내 설정 접근을 확인하는 Alert을 렌더링한다.", async () => {
    // given
    await waitFor(() => {
      render(<UserInformation />)
    })

    const settingButton = screen.getByRole("button", {name: /설정/})

    // when
    fireEvent.click(settingButton)

    // then
    const title = await screen.findByText(/내 설정 접근/)
    const content = await screen.findByText(
      /보안을 위해 현재 비밀번호를 입력해 주세요/
    )
    const cancelButton = await screen.findByRole("button", {name: "취소"})
    const confirmButton = await screen.findByRole("button", {name: "확인하기"})

    expect(title).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(confirmButton).toBeInTheDocument()
  })

  it("올바르지 않은 패스워드를 입력한 뒤 '확인하기' 버튼을 누르면 API 응답의 message가 ErrorAlert에 렌더링된다.", async () => {
    // given
    const message = "유효하지 않은 패스워드"
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: SIGN_UP.DIFFERENT_PASSWORDS,
      message,
    })

    await waitFor(() => {
      render(<UserInformation />)
    })

    const settingButton = screen.getByRole("button", {name: /설정/})
    fireEvent.click(settingButton)

    const passwordInput = await screen.findByPlaceholderText(
      "비밀번호를 입력해 주세요"
    )
    fireEvent.change(passwordInput, {target: {value: "invalid password"}})

    // when
    const confirmButton = await screen.findByRole("button", {name: "확인하기"})
    fireEvent.click(confirmButton)

    // then
    const alertContent = await screen.findByText(message)

    expect(alertContent).toBeInTheDocument()
  })

  it("올바른 패스워드를 입력한 뒤 '확인하기' 버튼을 누르면 인증 확인 Context가 true로 변경되고 내 설정 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({})

    await waitFor(() => {
      render(<UserInformation />)
    })

    const settingButton = screen.getByRole("button", {name: /설정/})
    fireEvent.click(settingButton)

    const passwordInput = await screen.findByPlaceholderText(
      "비밀번호를 입력해 주세요"
    )
    fireEvent.change(passwordInput, {target: {value: "valid password"}})

    // when
    const confirmButton = await screen.findByRole("button", {name: "확인하기"})
    fireEvent.click(confirmButton)

    // then
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_SETTING)
    })
  })
})
