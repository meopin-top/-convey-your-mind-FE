import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import type {ReactNode} from "react"
import Component from "@/components/my/setting/Email"
import {EmailProvider} from "@/components/my/setting/Context"
import type {TProps as TPortalProps} from "@/components/Portal"
import {INVALID_EMAILS, VALID_EMAIL} from "@/__mocks__/fixtures/input"
import {AUTH} from "@/constants/response-code"

const Email = () => {
  return (
    <EmailProvider>
      <Component />
    </EmailProvider>
  )
}

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
  default: ({isAlerting, content, onClose}: {isAlerting: boolean, content: ReactNode, onClose: () => void}) => (
    <>
      {isAlerting ? content : ""}
      <button onClick={onClose}>확인</button>
    </>
  )
}))

describe("Email", () => {
  it("컴포넌트를 올바르게 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Email />)
    })

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요")
    const emailVerificationButton = screen.getByRole("button", {name: /인증 메일 보내기/})
    const description = screen.getByText(/예비 이메일 등록 시, 추후 회원정보 찾기가 가능합니다./)

    // then
    expect(emailInput).toBeInTheDocument()
    expect(emailVerificationButton).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it("올바른 이메일 형식을 입력하지 않고 '인증 메일 보내기' 버튼을 클릭하면 '올바른 이메일 형식이 아닙니다.'라는 문구를 가진 FlowAlert 컴포넌트를 렌더링한다.", async () => {
    // given
    await waitFor(() => {
      render(<Email />)
    })

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요")
    const emailVerificationButton = screen.getByRole("button", {name: /인증 메일 보내기/})

    // when
    fireEvent.change(emailInput, {target: {value: INVALID_EMAILS[0]}})
    fireEvent.click(emailVerificationButton)

    // then
    const flowAlert = screen.getByText(/올바른 이메일 형식이 아닙니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("올바른 이메일 형식을 입력하고 '인증 메일 보내기' 버튼을 클릭하고 API가 정상적으로 동작하면 '인증 메일이 전송되었습니다.'라는 문구를 가진 FlowAlert 컴포넌트를 렌더링한다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: AUTH.USER.SEND_EMAIL_SUCCESS,
    })

    await waitFor(() => {
      render(<Email />)
    })

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요")
    const emailVerificationButton = screen.getByRole("button", {name: /인증 메일 보내기/})

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.click(emailVerificationButton)

    // then
    const flowAlert = await screen.findByText(/인증 메일이 전송되었습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("올바른 이메일 형식을 입력하고 '인증 메일 보내기' 버튼을 클릭했지만 API가 정상적으로 동작하지 않으면 '인증 메일 발송에는 실패했습니다.'라는 문구를 가진 FlowAlert 컴포넌트를 렌더링된다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: -1,
    })

    await waitFor(() => {
      render(<Email />)
    })

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요")
    const emailVerificationButton = screen.getByRole("button", {name: /인증 메일 보내기/})

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.click(emailVerificationButton)

    // then
    const flowAlert = await screen.findByText(/인증 메일 발송에는 실패했습니다./)

    expect(flowAlert).toBeInTheDocument()
  })
})
