import {render, screen, fireEvent} from "@testing-library/react"
import type {ReactNode} from "react"
import AllReceivedRollingPapers from "@/components/my/AllReceivedRollingPapers"
import {createAlertMock} from "@/__mocks__/window"
import {ALL_RECEIVED_ROLLING_PAPERS} from "@/constants/query-string"
import ROUTE from "@/constants/route"

const getSearchParamsMock = jest
  .fn()
  .mockReturnValue(ALL_RECEIVED_ROLLING_PAPERS)
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
jest.mock("../../../hooks/use-log-out.ts")

describe("AllReceivedRollingPapers", () => {
  beforeAll(() => {
    createAlertMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  function renderBottomSheet() {
    render(<AllReceivedRollingPapers />)

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    fireEvent.click(viewAllButton)
  }

  it("전체 보기 버튼을 렌더링한다.", () => {
    // given, when
    render(<AllReceivedRollingPapers />)

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    // then
    expect(viewAllButton).toBeInTheDocument()
  })

  it("렌더링될 때 바텀 시트가 열라는 쿼리 스트링이 포함된 URL이면 바텀 시트에 isOpen props로 true를 전달한다.", () => {
    render(<AllReceivedRollingPapers />)

    const bottomSheet = screen.getByText("isOpen: 열림")

    // then
    expect(bottomSheet).toBeInTheDocument()
  })

  it("렌더링될 때 바텀 시트가 열라는 쿼리 스트링이 포함된 URL이 아니면 바텀 시트에 isOpen props로 false를 전달한다.", () => {
    // given, when
    getSearchParamsMock.mockImplementationOnce(() => "close")

    render(<AllReceivedRollingPapers />)

    const bottomSheet = screen.getByText("isOpen: 닫힘")

    // then
    expect(bottomSheet).toBeInTheDocument()
  })

  it("전체 보기 버튼을 클릭하면 URL을 변경하며 바텀 시트에 isOpen props로 true를 전달한다.", () => {
    // given, when
    renderBottomSheet()

    const bottomSheet = screen.getByText("isOpen: 열림")

    // then
    expect(routerPushMock).toBeCalledWith(ROUTE.MY_ROLLING_PAPERS)
    expect(bottomSheet).toBeInTheDocument()
  })

  it("페이지네이션 input 유효한 페이지 범위를 벗어난 숫자를 입력할 경우 alert이 호출된다.", () => {
    // given
    renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1") as HTMLInputElement

    // when
    fireEvent.change(paginationInput, {
      target: {value: "999999"},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(window.alert).toBeCalledWith("유효한 페이지 범위가 아닙니다.")
  })

  it("페이지네이션 input에 유효한 페이지 범위의 숫자를 입력할 경우 alert이 호출된다.", () => {
    // TODO: API 호출로 바뀌어야 함
    // given
    renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1") as HTMLInputElement

    // when
    fireEvent.change(paginationInput, {
      target: {value: "1"},
    })
    fireEvent.keyDown(paginationInput, {
      key: "Enter",
    })

    // then
    expect(window.alert).toBeCalledWith("API 연동")
  })

  // TODO: API 연동
  // TODO: 페이지네이션 API 테스트
  // it("해당 프로젝트 생성자일 경우 왕관이 렌더링된다.", () => {

  // })

  // it("프로젝트 제목이 렌더링된다.", () => {

  // })

  // it("완성되지 않은 프로젝트의 경우 D-day가 렌더링된다.", () => {

  // })

  // it("프로젝트 상태에 따른 버튼이 렌더링된다.", () => {

  // })
})
