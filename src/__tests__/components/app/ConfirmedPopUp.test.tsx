import {render, screen, fireEvent} from "@testing-library/react"
import ConfirmedPopUp, {
  type TProps as TConfirmedPopUpProps,
} from "@/components/app/ConfirmedPopUp"
import type {TProps as TPortalProps} from "@/components/Portal"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import {
  VALID_USER_ID as TEST_USER_ID,
  VALID_PASSWORD as TEST_PASSWORD,
  INVALID_EMAILS,
  VALID_EMAILS,
} from "@/__mocks__/fixtures/input"

jest.mock("../../../components/SecretInput", () => ({
  __esModule: true,
  default: ({inputRef, ...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
}))
jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))

function renderConfirmedPopUp({
  isAlerting = true,
  isLoading = false,
  userId = TEST_USER_ID,
  password = TEST_PASSWORD,
  onClose = jest.fn(),
  onSubmit = jest.fn(),
}: Partial<TConfirmedPopUpProps>) {
  render(
    <ConfirmedPopUp
      isAlerting={isAlerting}
      isLoading={isLoading}
      userId={userId}
      password={password}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

describe("ConfirmedPopUp", () => {
  it("유저 아이디는 변경이 불가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const userIdInput = screen.getByDisplayValue(
      TEST_USER_ID
    ) as HTMLInputElement

    // then
    expect(userIdInput.disabled).toBeTruthy()
  })

  it("재확인용 비밀번호는 변경이 가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement

    // then
    expect(confirmedPasswordInput.disabled).toBeFalsy()
  })

  it("이메일은 변경이 가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const emailInput = screen.getAllByDisplayValue("")[1] as HTMLInputElement

    // then
    expect(emailInput.disabled).toBeFalsy()
  })

  it("취소와 가입하기 버튼이 렌더링된다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    expect(cancelButton).toBeInTheDocument()
    expect(signUpButton).toBeInTheDocument()
  })

  it("isLoading props가 false면 가입하기 버튼은 disabled 상태가 아니다.", () => {
    // given, when
    renderConfirmedPopUp({onSubmit: jest.fn(), isLoading: false})

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    expect(signUpButton).not.toBeDisabled()
  })

  it("isLoading props가 true면 가입하기 버튼은 disabled 상태이다.", () => {
    // given, when
    renderConfirmedPopUp({onSubmit: jest.fn(), isLoading: true})

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    expect(signUpButton).toBeDisabled()
  })

  it("기존에 입력한 비밀번호와 확인용 비밀번호가 다르면 onSubmit를 호출하지 않고, ErrorAlert를 호출한다", () => {
    // given
    const onSubmit = jest.fn()

    renderConfirmedPopUp({onSubmit})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(confirmedPasswordInput, {
      target: {value: "wrong-password"},
    })
    fireEvent.click(signUpButton)

    const errorAlert = screen.getByText("ErrorAlert open")

    // then
    expect(onSubmit).not.toHaveBeenCalled()
    expect(errorAlert).toBeInTheDocument()
  })

  it("이메일 형식이 다르면 onSubmit를 호출하지 않고, ErrorAlert를 호출한다.", () => {
    // given
    const onSubmit = jest.fn()

    renderConfirmedPopUp({onSubmit})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement
    const emailInput = screen.getAllByDisplayValue("")[1] as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(confirmedPasswordInput, {
      target: {value: TEST_PASSWORD},
    })

    INVALID_EMAILS.forEach((email) => {
      fireEvent.change(emailInput, {
        target: {value: email},
      })
      fireEvent.click(signUpButton)

      const errorAlert = screen.getByText("ErrorAlert open")

      // then
      expect(onSubmit).not.toHaveBeenCalled()
      expect(errorAlert).toBeInTheDocument()
    })
  })

  it("기존에 입력한 비밀번호와 확인용 비밀번호가 같고 이메일 형식이 일치하면, onSubmit을 호출한다.", () => {
    // given
    const onSubmit = jest.fn()

    renderConfirmedPopUp({onSubmit})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement
    const emailInput = screen.getAllByDisplayValue("")[1] as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(confirmedPasswordInput, {
      target: {value: TEST_PASSWORD},
    })

    VALID_EMAILS.forEach((email) => {
      fireEvent.change(emailInput, {
        target: {value: email},
      })
      fireEvent.click(signUpButton)

      // then
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it("취소 버튼을 누르면 onClose가 호출된다.", () => {
    // given
    const onClose = jest.fn()

    renderConfirmedPopUp({onClose})

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })

    // when
    fireEvent.click(cancelButton)

    // then
    expect(onClose).toHaveBeenCalled()
  })
})
