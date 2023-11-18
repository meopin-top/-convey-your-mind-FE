import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/app/WithoutSignUp"
import Context from "@/store/sign-in"
import {ROLLING_PAPER} from "@/constants/response-code"
import type {TProps as TPortalProps} from "@/components/Portal"
import type {TProps as TFlowAlertProps} from "@/components/FlowAlert"
import type {TRoute, TTab} from "@/@types/sign-in"
import {ROUTE} from "@/constants/service"

const setTabMock = jest.fn()
const setRedirectToMock = jest.fn()
const context = {
  tab: "signIn" as TTab,
  setTab: setTabMock,
  redirectTo: "/test" as TRoute,
  setRedirectTo: setRedirectToMock,
}

const WithoutSignUp = () => {
  return (
    <Context.Provider value={context}>
      <Component />
    </Context.Provider>
  )
}

const isLoading = false
const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../components/Loading", () => ({
  __esModule: true,
  default: () => <>loading</>,
}))
jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({
    isAlerting,
    content,
    defaultButton,
    onClose,
    additionalButton,
    onClick,
  }: TFlowAlertProps) => (
    <>
      <div data-testid="isAlerting">
        FlowAlert {isAlerting ? "open" : "close"}
      </div>
      <div>content {content}</div>
      <button onClick={onClose}>defaultButton {defaultButton}</button>
      <button onClick={onClick}>additionalButton {additionalButton}</button>
    </>
  ),
}))
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading,
  }),
}))

describe("WithoutSignUp", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("인풋과 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithoutSignUp />)

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    // then
    expect(sharedCodeInput).toBeInTheDocument()
    expect(participationButton).toBeInTheDocument()
  })

  it("공유코드 state를 올바르게 변경한다.", () => {
    // given
    render(<WithoutSignUp />)

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(sharedCodeInput, {target: {value}})

    // then
    expect(sharedCodeInput.value).toEqual(value)
  })

  it("입력 버튼 disabled 상태는 isLoading 상태와 동일하다.", () => {
    // given, when
    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    // then
    expect(participationButton).not.toBeDisabled()
  })

  it("입력 버튼 클릭 인터렉션이 없다면 FlowAlert는 렌더링되지 않는다.", () => {
    // given, when
    render(<WithoutSignUp />)

    const flowAlert = screen.getByText(/FlowAlert close/)

    // then
    expect(flowAlert).toBeInTheDocument()
  })

  it("입력 버튼 클릭 시 아무 공유 코드를 입력하지 않았다면 '공유코드나 URL을 입력해주세요'라는 문구가 포함된 FlowAlert가 노출된다.", () => {
    // given
    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    // when
    fireEvent.click(participationButton)

    const flowAlert = screen.getByText(/공유코드나 URL을 입력해주세요/)

    // then
    expect(flowAlert).toBeInTheDocument()
  })

  it("입력 버튼 클릭 시 참여 가능하지 않은 프로젝트의 공유 코드라면 '유효하지 않은 공유코드/URL입니다'라는 문구가 포함된 FlowAlert 노출된다.", async () => {
    // then
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE,
    })

    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })
    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement

    // when
    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    const flowAlert = await screen.findByText(
      /유효하지 않은 공유코드\/URL입니다/
    )

    // then
    expect(flowAlert).toBeInTheDocument()
  })

  it("입력 버튼 클릭 시 참여 가능한 프로젝트의 공유 코드라면 '로그인 후 더욱 편리하게 사용할 수 있어요'라는 문구가 포함된 FlowAlert가 노출된다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
    })

    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement

    // when
    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    const flowAlert = await screen.findByText(
      /로그인 후 더욱 편리하게 사용할 수 있어요/
    )

    // then
    expect(flowAlert).toBeInTheDocument()
  })

  it("'로그인 후 더욱 편리하게 사용할 수 있어요'라는 문구가 포함된 FlowAlert가 노출되면 '로그인' 버튼과 '계속' 버튼도 렌더링된다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
    })

    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement

    // when
    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    const signInButton = await screen.findByRole("button", {
      name: /로그인/,
    })
    const withOutSignInButton = await screen.findByRole("button", {
      name: /계속/,
    })

    // then
    expect(signInButton).toBeInTheDocument()
    expect(withOutSignInButton).toBeInTheDocument()
  })

  it("FlowAlert의 '로그인' 버튼을 누르면 context의 tab을 로그인으로, 로그인 시 redirection 링크를 롤링페이퍼 쓰기로 변경하고 FlowAlert를 종료한다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
    })

    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement

    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    // when

    const signInButton = await screen.findByRole("button", {
      name: /로그인/,
    })

    fireEvent.click(signInButton)

    // then
    await waitFor(() => {
      expect(setTabMock).toHaveBeenCalledTimes(1)
      expect(setTabMock).toHaveBeenCalledWith("signIn")
      expect(setRedirectToMock).toHaveBeenCalledTimes(1)
      expect(setRedirectToMock).toHaveBeenCalledWith(ROUTE.ROLLING_PAPER_EDIT)
    })
  })

  it("FlowAlert의 '계속' 버튼을 누르면 롤링페이퍼 쓰기 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
    })

    render(<WithoutSignUp />)

    const participationButton = screen.getByRole("button", {
      name: "입력",
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement

    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    // when
    const withOutSignInButton = await screen.findByRole("button", {
      name: /계속/,
    })

    fireEvent.click(withOutSignInButton)

    // then
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(ROUTE.ROLLING_PAPER_EDIT)
    })
  })
})
