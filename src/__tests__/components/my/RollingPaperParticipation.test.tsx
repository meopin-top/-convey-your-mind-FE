import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {useRouter} from "next/navigation"
import RollingPaperParticipation from "@/components/my/RollingPaperParticipation"
import type {TProps as TPortalProps} from "@/components/Portal"
import {ROLLING_PAPER} from "@/constants/response-code"
import ROUTE from "@/constants/route"

const isLoading = false
const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../components", () => ({
  __esModule: true,
  Portal: ({render}: TPortalProps) => <>{render()}</>,
  Loading: () => <>loading</>,
}))
jest.mock("../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading,
  }),
}))

describe("RollingPaperParticipation", () => {
  let alertMock: jest.SpyInstance

  beforeEach(() => {
    alertMock = jest.spyOn(window, "alert").mockImplementation(() => {})
  })

  afterEach(() => {
    alertMock.mockRestore()
  })

  it("인풋과 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<RollingPaperParticipation />)

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
    render(<RollingPaperParticipation />)

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

  it("참여하기 버튼 disabled 상태는 isLoading 상태와 동일하다.", () => {
    // given, when
    render(<RollingPaperParticipation />)

    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // then
    expect(participationButton).not.toBeDisabled()
  })

  it("참여하기 버튼 클릭 시 참여 가능한 프로젝트의 공유 코드라면 롤링 페이퍼 쓰기 페이지로 이동한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITE_CODE.QUERY_SUCCESS,
    })

    render(<RollingPaperParticipation />)

    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.click(participationButton)

    // then
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("참여하기 버튼 클릭 시 참여 가능하지 않은 프로젝트의 공유 코드라면 alert이 노출된다.", async () => {
    // then
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.INVITE_CODE.QUERY_FAILURE,
    })

    render(<RollingPaperParticipation />)

    const participationButton = screen.getByRole("button", {
      name: "참여하기",
    })

    // when
    fireEvent.click(participationButton)

    // then
    await waitFor(() => {
      expect(alertMock).toBeCalledWith("참여 가능한 공유 코드가 아닙니다.")
    })
  })
})
