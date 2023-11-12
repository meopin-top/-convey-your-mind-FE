import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import EmailInput from "@/components/account-inquiry/EmailInput"
import {TProps as TPortalProps} from "@/components/Portal"
import {INVALID_EMAILS, VALID_EMAIL} from "@/__mocks__/fixtures/input"
import {ACCOUNT_INQUIRY} from "@/constants/response-code"
import ROUTE from "@/constants/route"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <>loading</>,
}))
jest.mock("../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({
    isAlerting,
    onClose,
  }: {
    isAlerting: boolean
    onClose: () => void
  }) => (
    <div>
      FlowAlert {isAlerting ? "open" : "close"}
      <button onClick={onClose}>확인</button>
    </div>
  ),
}))

const requestMock = jest.fn()
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))

describe("EmailInput", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("인풋과 버튼을 올바르게 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<EmailInput />)
    })

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")
    const inquiryButton = screen.getByRole("button", {name: "내 정보 찾기"})

    // then
    expect(emailInput).toBeInTheDocument()
    expect(inquiryButton).toBeInTheDocument()
  })

  it("예비 이메일이 올바르게 입력된다.", async () => {
    // given
    const email = "test@test.com"

    await waitFor(() => {
      render(<EmailInput />)
    })

    const emailInput = screen.getByPlaceholderText(
      "예비 이메일 입력하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(emailInput, {
      target: {value: email},
    })

    // then
    expect(emailInput.value).toEqual(email)
  })

  it("이메일을 입력하지 않고 엔터를 누르면 FlowAlert가 호출된다.", async () => {
    // given
    await waitFor(() => {
      render(<EmailInput />)
    })

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")

    // when
    fireEvent.keyDown(emailInput, {key: "Enter"})

    // then
    const flowAlert = await screen.findByText("FlowAlert open")

    expect(flowAlert).toBeInTheDocument()
  })

  it("이메일을 입력하지 않고 '내 정보 찾기' 버튼을 클릭하면 FlowAlert가 호출된다.", async () => {
    // given
    await waitFor(() => {
      render(<EmailInput />)
    })

    const inquiryButton = screen.getByRole("button", {name: "내 정보 찾기"})

    // when
    fireEvent.click(inquiryButton)

    // then
    const flowAlert = await screen.findByText("FlowAlert open")

    expect(flowAlert).toBeInTheDocument()
  })

  it("올바른 이메일을 입력하지 않고 엔터를 누르면 FlowAlert가 호출된다.", async () => {
    // given
    await waitFor(() => {
      render(<EmailInput />)
    })

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")

    // when
    fireEvent.change(emailInput, {target: {value: INVALID_EMAILS[0]}})
    fireEvent.keyDown(emailInput, {key: "Enter"})

    // then
    const flowAlert = await screen.findByText("FlowAlert open")

    expect(flowAlert).toBeInTheDocument()
  })

  it("올바른 이메일을 입력하지 않고 '내 정보 찾기' 버튼을 클릭하면 FlowAlert가 호출된다.", async () => {
    // given
    await waitFor(() => {
      render(<EmailInput />)
    })

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")
    const inquiryButton = screen.getByRole("button", {name: "내 정보 찾기"})

    // when
    fireEvent.change(emailInput, {target: {value: INVALID_EMAILS[0]}})
    fireEvent.click(inquiryButton)

    // then
    const flowAlert = await screen.findByText("FlowAlert open")

    expect(flowAlert).toBeInTheDocument()
  })

  it("존재하지 않는 이메일을 입력 후 엔터를 눌러 FlowAlert가 호출될 때 '확인' 버튼을 누르면 FlowAlert가 사라진다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: ACCOUNT_INQUIRY.FAILURE,
      message: "이메일 미존재",
    })

    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.keyDown(emailInput, {key: "Enter"})

    // then
    const openedFlowAlert = await screen.findByText("FlowAlert open")
    const closeFlowAlertButton = await screen.findByRole("button", {
      name: "확인",
    })

    expect(openedFlowAlert).toBeInTheDocument()
    expect(closeFlowAlertButton).toBeInTheDocument()

    // when
    fireEvent.click(closeFlowAlertButton)

    // then
    const closedFlowAlert = await screen.findByText("FlowAlert close")

    expect(closedFlowAlert).toBeInTheDocument()
  })

  it("존재하지 않는 이메일을 입력 후 '내 정보 찾기' 버튼을 클릭해 FlowAlert가 호출될 때 '확인' 버튼을 누르면 FlowAlert가 사라진다.", async () => {
    // given
    requestMock.mockResolvedValue({
      code: ACCOUNT_INQUIRY.FAILURE,
      message: "이메일 미존재",
    })

    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")
    const inquiryButton = screen.getByRole("button", {name: "내 정보 찾기"})

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.click(inquiryButton)

    // then
    const openedFlowAlert = await screen.findByText("FlowAlert open")
    const closeFlowAlertButton = await screen.findByRole("button", {
      name: "확인",
    })

    expect(openedFlowAlert).toBeInTheDocument()
    expect(closeFlowAlertButton).toBeInTheDocument()

    // when
    fireEvent.click(closeFlowAlertButton)

    // then
    const closedFlowAlert = await screen.findByText("FlowAlert close")

    expect(closedFlowAlert).toBeInTheDocument()
  })

  it("존재하는 이메일을 입력 후 엔터를 눌러 FlowAlert가 호출될 때 '확인' 버튼을 누르면 FlowAlert가 사라지고 메인 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    requestMock.mockResolvedValue({
      code: ACCOUNT_INQUIRY.SUCCESS,
      message: "이메일 존재",
    })

    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.keyDown(emailInput, {key: "Enter"})

    // then
    const openedFlowAlert = await screen.findByText("FlowAlert open")
    const closeFlowAlertButton = await screen.findByRole("button", {
      name: "확인",
    })

    expect(openedFlowAlert).toBeInTheDocument()
    expect(closeFlowAlertButton).toBeInTheDocument()

    // when
    fireEvent.click(closeFlowAlertButton)

    // then
    const closedFlowAlert = await screen.findByText("FlowAlert close")

    expect(closedFlowAlert).toBeInTheDocument()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("존재하는 이메일을 입력 후 '내 정보 찾기' 버튼을 클릭해 FlowAlert가 호출될 때 '확인' 버튼을 누르면 FlowAlert가 사라지고 메인 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    requestMock.mockResolvedValue({
      code: ACCOUNT_INQUIRY.SUCCESS,
      message: "이메일 존재",
    })

    render(<EmailInput />)

    const emailInput = screen.getByPlaceholderText("예비 이메일 입력하기")
    const inquiryButton = screen.getByRole("button", {name: "내 정보 찾기"})

    // when
    fireEvent.change(emailInput, {target: {value: VALID_EMAIL}})
    fireEvent.click(inquiryButton)

    // then
    const openedFlowAlert = await screen.findByText("FlowAlert open")
    const closeFlowAlertButton = await screen.findByRole("button", {
      name: "확인",
    })

    expect(openedFlowAlert).toBeInTheDocument()
    expect(closeFlowAlertButton).toBeInTheDocument()

    // when
    fireEvent.click(closeFlowAlertButton)

    // then
    const closedFlowAlert = await screen.findByText("FlowAlert close")

    expect(closedFlowAlert).toBeInTheDocument()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })
})
