import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import type {ReactNode} from "react"
import Component from "@/components/my/setting/SubmitButton"
import {
  PasswordStore,
  ProfileStore,
  NicknameStore,
  EmailStore,
} from "@/components/my/setting/Context"
import type {TProps as TPortalProps} from "@/components/Portal"
import {createLocalStorageMock} from "@/__mocks__/window"
import {removeLocalStorageMock} from "@/__mocks__/window"
import {
  INVALID_EMAILS,
  INVALID_PASSWORDS,
  VALID_EMAIL,
  VALID_PASSWORD,
} from "@/__mocks__/fixtures/input"
import {AUTH} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const SubmitButton = ({
  password = "",
  passwordConfirm = "",
  nickname = "",
  email = "",
}: {
  password?: string
  passwordConfirm?: string
  nickname?: string
  email?: string
}) => {
  return (
    <PasswordStore.Provider
      value={{
        password,
        passwordConfirm,
        handlePassword: jest.fn(),
        handlePasswordConfirm: jest.fn(),
      }}
    >
      <ProfileStore.Provider
        value={{
          profile: {type: "uploadUrl", data: "", url: ""},
          setProfile: jest.fn(),
        }}
      >
        <NicknameStore.Provider
          value={{nickname, setNickname: jest.fn(), handleNickname: jest.fn()}}
        >
          <EmailStore.Provider
            value={{email, setEmail: jest.fn(), handleEmail: jest.fn()}}
          >
            <Component />
          </EmailStore.Provider>
        </NicknameStore.Provider>
      </ProfileStore.Provider>
    </PasswordStore.Provider>
  )
}

const routerPushMock = jest.fn()
const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: routerPushMock,
  }),
}))
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))
jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({
    isAlerting,
    content,
    onClose,
  }: {
    isAlerting: boolean
    content: ReactNode
    onClose: () => void
  }) => (
    <>
      {isAlerting ? content : ""}
      <button onClick={onClose}>확인</button>
    </>
  ),
}))

describe("SubmitButton", () => {
  beforeEach(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    removeLocalStorageMock()
  })

  it("'저장하기' 버튼을 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<SubmitButton />)
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // then
    expect(submitButton).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 클릭할 때 비밀번호를 입력했지만 유효하지 않은 비밀번호면 '비밀번호 조건을 충족하지 않았습니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(<SubmitButton password={INVALID_PASSWORDS[0]} />)
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const flowAlert = screen.getByText(/비밀번호 조건을 충족하지 않았습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 클릭할 때 비밀번호를 입력했지만 비밀번호 확인과 다르면 '비밀번호가 일치하지 않습니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(<SubmitButton password={VALID_PASSWORD} />)
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const flowAlert = screen.getByText(/비밀번호가 일치하지 않습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 클릭할 때 비밀번호 확인을 입력했지만 비밀번호와 다르면 '비밀번호가 일치하지 않습니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD + "wrong"}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const flowAlert = screen.getByText(/비밀번호가 일치하지 않습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 클릭할 때 닉네임을 입력하지 않으면 '닉네임이 입력되지 않았습니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const flowAlert = screen.getByText(/닉네임이 입력되지 않았습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 클릭할 때 이메일을 입력했지만 유효하지 않은 이메일이면 '이메일 형식이 올바르지 않습니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
          nickname="nickname"
          email={INVALID_EMAILS[0]}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const flowAlert = screen.getByText(/이메일 형식이 올바르지 않습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("모든 입력이 유효하면 API를 호출한다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: 0,
      data: {
        nickName: "",
        profile: "",
      },
    })

    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
          nickname="nickname"
          email={VALID_EMAIL}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    await waitFor(() => {
      expect(requestMock).toHaveBeenCalledTimes(1)
    })
  })

  it("'저장하기' 버튼을 누를 때 호출하는 API 응답이 1016이면 '이미 존재하는 이메일입니다.'라는 문구가 포함된 얼럿이 노출된다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: AUTH.USER.DUPLICATED_EMAIL,
      data: {
        nickName: "",
        profile: "",
      },
    })

    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
          nickname="nickname"
          email={VALID_EMAIL}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const florAlert = await screen.findByText(/이미 존재하는 이메일입니다./)

    expect(florAlert).toBeInTheDocument()
  })

  it("'저장하기' 버튼을 누를 때 호출하는 API 응답이 정상이면 '변경 사항이 저장되었습니다.'라는 문구가 포함된 얼럿이 노출되고 로컬 스토리지에 닉네임과 프로필을 저장한다.", async () => {
    // given
    const nickName = "test nickName"
    const profile = "test profile"
    requestMock.mockResolvedValue({
      code: 0,
      data: {
        nickName,
        profile,
      },
    })

    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
          nickname="nickname"
          email={VALID_EMAIL}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    // when
    fireEvent.click(submitButton)

    // then
    const florAlert = await screen.findByText(/변경 사항이 저장되었습니다./)

    expect(florAlert).toBeInTheDocument()
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "nickName",
      nickName
    )
    expect(window.localStorage.setItem).toHaveBeenCalledWith("profile", profile)
  })

  it("'저장하기' 버튼을 누를 때 호출하는 API 응답이 정상일 때 노출되는 얼럿에서 '확인' 버튼을 누르면 마이페이지로 이동한다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: 0,
      data: {
        nickName: "",
        profile: "",
      },
    })

    await waitFor(() => {
      render(
        <SubmitButton
          password={VALID_PASSWORD}
          passwordConfirm={VALID_PASSWORD}
          nickname="nickname"
          email={VALID_EMAIL}
        />
      )
    })

    const submitButton = screen.getByRole("button", {name: "저장하기"})

    fireEvent.click(submitButton)

    const confirmButton = await screen.findAllByText("확인")

    // when
    fireEvent.click(confirmButton[1])

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })
})
