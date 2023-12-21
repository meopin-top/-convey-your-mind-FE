import {render, screen, fireEvent} from "@testing-library/react"
import {forwardRef, type ForwardedRef} from "react"
import Component from "@/components/my/setting/Password"
import {PasswordProvider} from "@/components/my/setting/Context"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"

const Password = () => {
  return (
    <PasswordProvider>
      <Component />
    </PasswordProvider>
  )
}

jest.mock("../../../../components/SecretInput.tsx", () => ({
  __esModule: true,
  // eslint-disable-next-line react/display-name
  default: forwardRef<HTMLInputElement, Omit<TSecretInputProps, "size">>(
    (
      {...props}: Omit<TSecretInputProps, "size">,
      ref: ForwardedRef<HTMLInputElement>
    ) => {
      return <input className="password" ref={ref} {...props} />
    }
  ),
}))

describe("Password", () => {
  it("유저 비밀번호 인풋, 비밀번호 확인 인풋을 올바르게 렌더링한다.", () => {
    // given, when
    render(<Password />)

    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const passwordConfirmInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[1]

    // then
    expect(passwordInput).toBeInTheDocument()
    expect(passwordConfirmInput).toBeInTheDocument()
  })

  it("입력된 유저 비밀번호 영문 포함 여부에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<Password />)

    const PASSWORD_WITHOUT_ENGLISH = "1234"
    const PASSWORD_WITH_ENGLISH = "1234password"
    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const validityLight = screen.getAllByRole("status")[0]

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITHOUT_ENGLISH},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITH_ENGLISH},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })

  it("입력된 유저 비밀번호 숫자 포함 여부에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<Password />)

    const PASSWORD_WITHOUT_NUMBER = "password"
    const PASSWORD_WITH_NUMBER = "1234password"
    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const validityLight = screen.getAllByRole("status")[1]

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITHOUT_NUMBER},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITH_NUMBER},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })

  it("입력된 유저 비밀번호 특수 문자 포함 여부에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<Password />)

    const PASSWORD_WITHOUT_SPECIAL_CHARACTER = "password"
    const PASSWORD_WITH_SPECIAL_CHARACTER = "1234password!@"
    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const validityLight = screen.getAllByRole("status")[2]

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITHOUT_SPECIAL_CHARACTER},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD_WITH_SPECIAL_CHARACTER},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })

  it("입력된 유저 비밀번호 길이에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<Password />)

    const SHORT_PASSWORD = "pw"
    const LONG_PASSWORD = "password"
    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const validityLight = screen.getAllByRole("status")[3]

    // when
    fireEvent.change(passwordInput, {
      target: {value: SHORT_PASSWORD},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(passwordInput, {
      target: {value: LONG_PASSWORD},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })

  it("입력된 유저 비밀번호와 비밀번호 확인 일치 여부에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<Password />)

    const password = "password"
    const passwordInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[0]
    const passwordConfirmInput = screen.getAllByPlaceholderText("비밀번호를 입력해주세요.")[1]
    const validityLight = screen.getAllByRole("status")[4]

    // when
    fireEvent.change(passwordInput, {
      target: {value: password},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(passwordConfirmInput, {
      target: {value: password},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })
})
