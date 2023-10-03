import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import SignUp from "@/components/app/SignUp"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import type {TProps as TPortalProps} from "@/components/Portal"
import {
  VALID_USER_ID,
  INVALID_USER_IDS,
  VALID_PASSWORD,
  INVALID_PASSWORDS,
} from "@/__mocks__/fixtures/input"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../components/app/ConfirmedPopUp.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>{isAlerting ? "정보를 확인해주세요" : ""}</>
  ),
}))
jest.mock("../../../components/SecretInput.tsx", () => ({
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

describe("SignUp", () => {
  it("유저 아이디 인풋, 유저 비밀번호 인풋, 회원가입 버튼을 올바르게 렌더링한다.", async () => {
    // given, when
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText("나만의 ID로 시작하기")
    const passwordInput = screen.getByPlaceholderText("나만의 PW로 시작하기")
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    await waitFor(() => {
      expect(userIdInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
      expect(signUpButton).toBeInTheDocument()
    })
  })

  it("유저 아이디가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const USER_ID = "test1234"
    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(userIdInput, {
      target: {value: USER_ID},
    })

    // then
    await waitFor(() => {
      expect(userIdInput.value).toEqual(USER_ID)
    })
  })

  it("입력된 유저 아이디 길이에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<SignUp />)

    const SHORT_USER_ID = "id"
    const LONG_USER_ID = "userId"
    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const validityLight = screen.getAllByRole("status")[0]

    // when
    fireEvent.change(userIdInput, {
      target: {value: SHORT_USER_ID},
    })

    // then
    expect(validityLight.classList).toContain("invalid-light")

    // when
    fireEvent.change(userIdInput, {
      target: {value: LONG_USER_ID},
    })

    // then
    expect(validityLight.classList).toContain("valid-light")
  })

  it("입력된 유저 비밀번호 영문 포함 여부에 따라 유효성 light 상태가 변한다.", () => {
    // given
    render(<SignUp />)

    const PASSWORD_WITHOUT_ENGLISH = "1234"
    const PASSWORD_WITH_ENGLISH = "1234password"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const validityLight = screen.getAllByRole("status")[1]

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
    render(<SignUp />)

    const PASSWORD_WITHOUT_NUMBER = "password"
    const PASSWORD_WITH_NUMBER = "1234password"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const validityLight = screen.getAllByRole("status")[2]

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
    render(<SignUp />)

    const PASSWORD_WITHOUT_SPECIAL_CHARACTER = "password"
    const PASSWORD_WITH_SPECIAL_CHARACTER = "1234password!@"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const validityLight = screen.getAllByRole("status")[3]

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
    render(<SignUp />)

    const SHORT_PASSWORD = "pw"
    const LONG_PASSWORD = "password"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const validityLight = screen.getAllByRole("status")[4]

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

  it("유저 비밀번호가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const PASSWORD = "test1234"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(passwordInput, {
      target: {value: PASSWORD},
    })

    // then
    await waitFor(() => {
      expect(passwordInput.value).toEqual(PASSWORD)
    })
  })

  it("유저 아이디를 입력하지 않으면 ErrorAlert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.click(signUpButton)

    // then
    const errorAlert = await screen.findByText("ErrorAlert open")

    expect(errorAlert).toBeInTheDocument()
  })

  it("유저 아이디를 입력하지 않으면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      const confirmedPopUp = screen.queryByText(/정보를 확인해주세요/)

      expect(confirmedPopUp).not.toBeInTheDocument()
    })
  })

  it("유저 아이디를 입력해도 유저 비밀번호를 입력하지 않으면 errorAlert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: VALID_USER_ID},
    })
    fireEvent.click(signUpButton)

    // then
    const errorAlert = await screen.findByText("ErrorAlert open")

    expect(errorAlert).toBeInTheDocument()
  })

  it("유저 아이디를 입력해도 유저 비밀번호를 입력하지 않으면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: VALID_USER_ID},
    })
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      const confirmedPopUp = screen.queryByText(/정보를 확인해주세요/)

      expect(confirmedPopUp).not.toBeInTheDocument()
    })
  })

  for (const userId of INVALID_USER_IDS) {
    it("유저 아이디 형식이 다르면 errorAlert를 호출한다.", async () => {
      // given
      render(<SignUp />)

      const userIdInput = screen.getByPlaceholderText(
        "나만의 ID로 시작하기"
      ) as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText(
        "나만의 PW로 시작하기"
      ) as HTMLInputElement
      const signUpButton = screen.getByRole("button", {
        name: "가입하기",
      })

      // when
      fireEvent.change(passwordInput, {
        target: {value: VALID_PASSWORD},
      })

      fireEvent.change(userIdInput, {
        target: {value: userId},
      })
      fireEvent.click(signUpButton)

      const errorAlert = await screen.findByText("ErrorAlert open")

      // then
      expect(errorAlert).toBeInTheDocument()
    })
  }

  it("유저 아이디 형식이 다르면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(passwordInput, {
      target: {value: VALID_PASSWORD},
    })

    for (const userId of INVALID_USER_IDS) {
      fireEvent.change(userIdInput, {
        target: {value: userId},
      })
      fireEvent.click(signUpButton)

      // then
      await waitFor(() => {
        const confirmedPopUp = screen.queryByText(/정보를 확인해주세요/)

        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    }
  })

  for (const password of INVALID_PASSWORDS) {
    it("유저 비밀번호 형식이 다르면 errorAlert를 호출한다.", async () => {
      // given
      render(<SignUp />)

      const userIdInput = screen.getByPlaceholderText(
        "나만의 ID로 시작하기"
      ) as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText(
        "나만의 PW로 시작하기"
      ) as HTMLInputElement
      const signUpButton = screen.getByRole("button", {
        name: "가입하기",
      })

      // when
      fireEvent.change(userIdInput, {
        target: {value: VALID_USER_ID},
      })

      fireEvent.change(passwordInput, {
        target: {value: password},
      })
      fireEvent.click(signUpButton)

      const errorAlert = await screen.findByText("ErrorAlert open")

      // then
      expect(errorAlert).toBeInTheDocument()
    })
  }

  it("유저 비밀번호 형식이 다르면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: VALID_USER_ID},
    })

    for (const password of INVALID_PASSWORDS) {
      fireEvent.change(passwordInput, {
        target: {value: password},
      })
      fireEvent.click(signUpButton)

      // then
      await waitFor(() => {
        const confirmedPopUp = screen.queryByText(/정보를 확인해주세요/)

        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    }
  })

  it("유저 아이디와 유저 비밀번호 형식이 올바르면 errorAlert를 호출하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIddInput, {
      target: {value: VALID_USER_ID},
    })
    fireEvent.change(passwordInput, {
      target: {value: VALID_PASSWORD},
    })
    fireEvent.click(signUpButton)

    const errorAlert = await screen.findByText(/ErrorAlert close/)

    // then
    expect(errorAlert).toBeInTheDocument()
  })

  it("유저 아이디와 유저 비밀번호 형식이 올바르면 ConfirmedPopUp을 렌더링한다.", async () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIddInput, {
      target: {value: VALID_USER_ID},
    })
    fireEvent.change(passwordInput, {
      target: {value: VALID_PASSWORD},
    })
    fireEvent.click(signUpButton)

    await waitFor(() => {
      // then
      const confirmedPopUp = screen.getByText(/정보를 확인해주세요/)

      expect(confirmedPopUp).toBeInTheDocument()
    })
  })
})
