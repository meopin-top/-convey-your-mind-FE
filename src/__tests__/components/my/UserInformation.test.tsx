import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/my/UserInformation"
import Store from "@/store/setting-auth"
import type {TProps as TPortalProps} from "@/components/Portal"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"

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

const routerPushMock = jest.fn()
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: routerPushMock,
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
  it("설정 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<UserInformation />)

    const settingButton = screen.getByRole("button", {name: /설정/})

    // then
    expect(settingButton).toBeInTheDocument()
  })

  it("설정 버튼을 클릭하면 내 설정 접근을 확인하는 Alert을 렌더링한다.", async () => {
    // given
    render(<UserInformation />)

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

  // TODO: change
  it("확인하기 버튼을 누르면 인증 확인 Context가 true로 변경된다.", async () => {
    // given
    const setCheckedMock = jest.fn()

    render(<UserInformation setChecked={setCheckedMock} />)

    const settingButton = screen.getByRole("button", {name: /설정/})
    fireEvent.click(settingButton)

    const confirmButton = await screen.findByRole("button", {name: "확인하기"})

    // when
    fireEvent.click(confirmButton)

    // then
    expect(setCheckedMock).toHaveBeenCalledWith(true)
  })
})
