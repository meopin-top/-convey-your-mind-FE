import {render, screen} from "@testing-library/react"
import SettingConfirmAlert from "@/components/my/SettingConfirmAlert"
import type {TProps as TPortalProps} from "@/components/Portal"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"

// jest.mock("next/navigation", () => ({
//   __esModule: true,
//   useRouter: jest.fn(),
// }))
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

describe("SettingConfirmAlert", () => {
  it("내용과 버튼을 올바르게 렌더링한다.", async () => {
    // given
    render(<SettingConfirmAlert isAlerting onClose={jest.fn()} />)

    // when
    const title = await screen.findByText(/내 설정 접근/)
    const content = await screen.findByText(
      /보안을 위해 현재 비밀번호를 입력해 주세요/
    )
    const cancelButton = await screen.findByRole("button", {name: "취소"})
    const confirmButton = await screen.findByRole("button", {name: "확인하기"})

    // then
    expect(title).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(confirmButton).toBeInTheDocument()
  })
})
