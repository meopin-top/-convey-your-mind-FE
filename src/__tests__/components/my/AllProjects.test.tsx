import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import type {ReactNode} from "react"
import AllProjects from "@/components/my/AllProjects"
import {calculateRemainingDay} from "@/utils/formatter"
import {ROLLING_PAPER_STATUS} from "@/constants/request"
import {ALL_PROJECTS, ROUTE} from "@/constants/service"

const getSearchParamsMock = jest.fn().mockReturnValue(ALL_PROJECTS)
const routerPushMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: getSearchParamsMock,
  }),
  useRouter: () => ({
    push: routerPushMock,
  }),
}))
jest.mock("../../../components/BottomSheet.tsx", () => ({
  __esModule: true,
  default: ({isOpen, children}: {isOpen: boolean; children: ReactNode}) => (
    <>
      <div>isOpen: {isOpen ? "열림" : "닫힘"}</div>
      {children}
    </>
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

describe("AllProjects", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  async function renderBottomSheet() {
    await waitFor(() => {
      render(<AllProjects />)
    })

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    fireEvent.click(viewAllButton)
  }

  it("전체 보기 버튼을 렌더링한다.", async () => {
    // given, when
    requestMock.mockResolvedValue({
      data: {
        totalLength: 0,
        pageResult: [],
      },
    })

    await waitFor(() => {
      render(<AllProjects />)
    })

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    // then
    expect(viewAllButton).toBeInTheDocument()
  })

  it("렌더링될 때 바텀 시트를 열라는 쿼리 스트링이 포함된 URL이면 바텀 시트에 isOpen props로 true를 전달한다.", async () => {
    // given, when
    requestMock.mockResolvedValue({
      data: {
        totalLength: 0,
        pageResult: [],
      },
    })

    await waitFor(() => {
      render(<AllProjects />)
    })

    const bottomSheet = screen.getByText("isOpen: 열림")

    // then
    expect(bottomSheet).toBeInTheDocument()
  })

  it("렌더링될 때 바텀 시트를 열라는 쿼리 스트링이 포함된 URL이 아니면 바텀 시트에 isOpen props로 false를 전달한다.", async () => {
    // given, when
    getSearchParamsMock.mockImplementationOnce(() => "close")

    await waitFor(() => {
      render(<AllProjects />)
    })

    const bottomSheet = screen.getByText("isOpen: 닫힘")

    // then
    expect(bottomSheet).toBeInTheDocument()
  })

  it("전체 보기 버튼을 클릭하면 URL을 변경하며 바텀 시트에 isOpen props로 true를 전달한다.", async () => {
    // given, when
    requestMock.mockResolvedValue({
      data: {
        totalLength: 0,
        pageResult: [],
      },
    })

    await renderBottomSheet()

    const bottomSheet = screen.getByText("isOpen: 열림")

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PROJECTS)
    expect(bottomSheet).toBeInTheDocument()
  })

  it("페이지네이션 input 0이하일 경우 1페이지로 이동한다.", async () => {
    // given
    requestMock.mockResolvedValue({
      data: {
        totalLength: 1,
        pageResult: [],
      },
    })

    await renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1") as HTMLInputElement

    // when
    fireEvent.change(paginationInput, {
      target: {value: "0"},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(paginationInput.value).toEqual("1")

    // when
    fireEvent.change(paginationInput, {
      target: {value: "-100"},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(paginationInput.value).toEqual("1")
  })

  it("페이지네이션 input 마지막 페이지보다 클 경우 마지막 페이지로 이동한다.", async () => {
    // given
    const TOTAL_LENGTH = 20
    requestMock.mockResolvedValue({
      data: {
        totalLength: TOTAL_LENGTH,
        pageResult: [],
      },
    })

    await renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1") as HTMLInputElement

    // when
    fireEvent.change(paginationInput, {
      target: {value: "999999"},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(paginationInput.value).toEqual(
      Math.ceil(TOTAL_LENGTH / 5).toString() // 5: 페이지 사이즈
    )
  })

  it("페이지네이션 input에 유효한 페이지 범위의 숫자를 입력할 경우 해당 페이지로 이동한다.", async () => {
    // given
    const VALID_PAGE = "2"

    requestMock.mockResolvedValue({
      data: {
        totalLength: 20,
        pageResult: [],
      },
    })

    await renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1") as HTMLInputElement

    // when
    fireEvent.change(paginationInput, {
      target: {value: VALID_PAGE},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(paginationInput.value).toEqual(VALID_PAGE)
  })

  it("참여 중인 프로젝트 정보를 올바르게 렌더링한다.", async () => {
    // given, when
    const DESTINATION = "someone"
    const EXPIRED_DATETIME = "2024-03-04T15:00:00"
    const STATUS = "R"
    const INVITE_CODE = "abcdefu"

    requestMock.mockResolvedValue({
      data: {
        totalLength: 1,
        pageResult: [
          {
            id: 12,
            inviteCode: INVITE_CODE,
            maxInviteNum: 10,
            destination: DESTINATION,
            type: "D",
            status: STATUS,
            createdDatetime: "2023-11-26T05:54:56.602386",
            updatedDatetime: "2023-11-26T05:54:56.602386",
            expiredDatetime: EXPIRED_DATETIME,
            owner: true,
          },
        ],
      },
    })

    await renderBottomSheet()

    // then
    const destination = screen.getByText(DESTINATION)
    const dDay = screen.getByText(
      `D-${Math.max(Math.min(calculateRemainingDay(EXPIRED_DATETIME), 999), 0)}`
    )
    const status = screen.getByText(ROLLING_PAPER_STATUS[STATUS])

    expect(destination).toBeInTheDocument()
    expect(dDay).toBeInTheDocument()
    expect(status).toBeInTheDocument()
  })
})
