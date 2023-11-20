import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import RollingPaperParticipation from "@/components/my/RollingPaperParticipation"
import type {TProps as TPortalProps} from "@/components/Portal"
import {ROLLING_PAPER} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const requestMock = jest.fn()

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
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))

describe("RollingPaperParticipation", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("인풋과 버튼을 올바르게 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // then
    expect(sharedCodeInput).toBeInTheDocument()
    expect(participationButton).toBeInTheDocument()
  })

  it("공유코드 state를 올바르게 변경한다.", async () => {
    // given
    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(sharedCodeInput, {target: {value}})

    // then
    await waitFor(() => {
      expect(sharedCodeInput.value).toEqual(value)
    })
  })

  it("유효하지 않은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 API 메시지를 얼럿으로 보여준다.", async () => {
    // given
    const message = "유효하지 않은 초대 코드"
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE,
      message,
    })

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    // then
    const alertContent = await screen.findByText(message)

    expect(alertContent).toBeInTheDocument()
  })

  it("존재하지 않은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 API 메시지를 얼럿으로 보여준다.", async () => {
    // given
    const message = "유효하지 않은 초대 코드"
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.INVALID_SHARING_CODE,
      message,
    })

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: "test"}})
    fireEvent.click(participationButton)

    // then
    const alertContent = await screen.findByText(message)

    expect(alertContent).toBeInTheDocument()
  })

  it("참여자로 받은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 롤링 페이퍼 쓰기 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS,
      data: {
        status: ROLLING_PAPER.INVITATION_SUCCESS_STATUS,
      },
    })
    const sharingCode = "test"

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: sharingCode}})
    fireEvent.click(participationButton)

    // then
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(
        `${ROUTE.ROLLING_PAPER_EDIT}/${sharingCode}`
      )
    })
  })

  it("수신자로 받은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 '롤링페이퍼 등록 성공'이 포함된 문구를 얼럿으로 보여준다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS,
      data: {
        status: ROLLING_PAPER.RECEIPT_SUCCESS_STATUS,
      },
    })
    const sharingCode = "test"

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: sharingCode}})
    fireEvent.click(participationButton)

    // then
    const alertContent = await screen.findByText(/롤링페이퍼 등록 성공/)

    expect(alertContent).toBeInTheDocument()
  })

  it("수신자로 받은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 나오는 얼럿에서 '확인' 버튼 클릭 시 롤링 페이퍼 보기 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS,
      data: {
        status: ROLLING_PAPER.RECEIPT_SUCCESS_STATUS,
      },
    })
    const sharingCode = "test"

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: sharingCode}})
    fireEvent.click(participationButton)

    // then
    const okButton = await screen.findByRole("button", {name: "확인"})

    expect(okButton).toBeInTheDocument()

    // when
    fireEvent.click(okButton)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(
      `${ROUTE.ROLLING_PAPER_VIEW}/${sharingCode}`
    )
  })

  it("수신자로 받은 초대 코드를 입력 한 뒤 참여하기 버튼 클릭 시 나오는 얼럿에서 '취소' 버튼 클릭 시 얼럿이 닫힌다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS,
      data: {
        status: ROLLING_PAPER.RECEIPT_SUCCESS_STATUS,
      },
    })
    const sharingCode = "test"

    await waitFor(() => {
      render(<RollingPaperParticipation />)
    })

    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드 or URL을 입력해 주세요"
    ) as HTMLInputElement
    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.change(sharedCodeInput, {target: {value: sharingCode}})
    fireEvent.click(participationButton)

    // then
    let cancelButton = await screen.findByRole("button", {name: "취소"})

    expect(cancelButton).toBeInTheDocument()

    // when
    fireEvent.click(cancelButton)

    // then
    cancelButton = screen.queryByRole("button", {name: "취소"}) as HTMLElement

    expect(cancelButton).not.toBeInTheDocument()
  })
})
