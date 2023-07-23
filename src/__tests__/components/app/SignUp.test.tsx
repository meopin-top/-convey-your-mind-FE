import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {redirect} from "next/navigation"
import SignUp from "@/components/app/SignUp"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import type {TProps as TPortalProps} from "@/components/Portal"
import {
  validUserId,
  validUserIds,
  invalidUserIds,
  validPassword,
  validPasswords,
  invalidPasswords,
} from "@/__mocks__/fixtures/input"
import ROUTE from "@/constants/route"

const testid = "confirmed-pop-up"

jest.mock("next/navigation", () => ({
  __esModule: true,
  redirect: jest.fn(),
}))

jest.mock("../../../components", () => ({
  __esModule: true,
  SecretInput: ({inputRef, ...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
  Portal: ({render}: TPortalProps) => <>{render()}</>,
}))

jest.mock("../../../components/app", () => ({
  __esModule: true,
  ConfirmedPopUp: () => <div data-testid={testid} />,
}))

describe("SignUp", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
  })

  it("유저 아이디가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const userId = "test1234"
    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(userIdInput, {
      target: {value: userId},
    })

    // then
    await waitFor(() => {
      expect(userIdInput.value).toEqual(userId)
    })
  })

  it("유저 비밀번호가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const password = "test1234"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(passwordInput, {
      target: {value: password},
    })

    // then
    await waitFor(() => {
      expect(passwordInput.value).toEqual(password)
    })
  })

  it("유저 아이디 형식이 다르면 alert를 호출하고, ConfirmedPopUp을 렌더링하지 않는다.", () => {
    // given
    render(<SignUp />)

    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    fireEvent.change(passwordInput, {
      target: {value: validPassword},
    })

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement

    invalidUserIds.forEach(async (userId) => {
      // when
      fireEvent.change(userIdInput, {
        target: {value: userId},
      })

      await waitFor(() => {
        const confirmedPopUp = screen.queryByTestId("confirmed-pop-up")

        // then
        expect(windowAlertMock).toBeCalled()
        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    })
  })

  it("유저 비밀번호 형식이 다르면 alert를 호출하고, ConfirmedPopUp을 렌더링하지 않는다.", () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    fireEvent.change(userIddInput, {
      target: {value: validUserId},
    })

    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement

    invalidPasswords.forEach(async (password) => {
      // when
      fireEvent.change(passwordInput, {
        target: {value: password},
      })

      await waitFor(() => {
        const confirmedPopUp = screen.queryByTestId("confirmed-pop-up")

        // then
        expect(windowAlertMock).toBeCalled()
        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    })
  })

  it("유저 아이디와 유저 비밀번호 형식이 올바르면 alert를 호출하지 않고 MY_PAGE로 리다이렉트된다.", () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement

    validUserIds.forEach((userId) => {
      validPasswords.forEach(async (password) => {
        // when
        fireEvent.change(userIddInput, {
          target: {value: userId},
        })
        fireEvent.change(passwordInput, {
          target: {value: password},
        })

        await waitFor(() => {
          // then
          expect(windowAlertMock).not.toBeCalled()
          expect(redirect).toBeCalledWith(ROUTE.MY_PAGE)
        })
      })
    })
  })
})
