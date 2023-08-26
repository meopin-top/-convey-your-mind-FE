import {render, screen, fireEvent} from "@testing-library/react"
import type {ReactNode} from "react"
import AllProjects from "@/components/my/AllProjects"
import {createAlertMock} from "@/__mocks__/window"

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

describe("AllProjects", () => {
  beforeAll(() => {
    createAlertMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  function renderBottomSheet() {
    render(<AllProjects />)

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    fireEvent.click(viewAllButton)
  }

  it("전체 보기 버튼을 렌더링한다.", () => {
    // given, when
    render(<AllProjects />)

    const viewAllButton = screen.getByRole("button", {
      name: "> 전체 보기",
    })

    // then
    expect(viewAllButton).toBeInTheDocument()
  })

  it("전체 보기 버튼을 클릭하면 바텀 시트에 isOpen props로 true를 전달한다.", () => {
    // given, when
    renderBottomSheet()

    const bottomSheet = screen.getByText("isOpen: 열림")

    // then
    expect(bottomSheet).toBeInTheDocument()
  })

  it("previous / next 페이지네이션 이동 버튼이 렌더링된다.", () => {
    // given, when
    renderBottomSheet()

    const previousButton = screen.getByRole("button", {
      name: "<",
    })
    const nextButton = screen.getByRole("button", {
      name: ">",
    })

    // then
    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it("양 끝 페이지가 아닐 경우 previous, next 페이지네이션 이동 버튼이 disabled 상태가 아니다.", () => {
    // given
    renderBottomSheet()

    const previousButton = screen.getByRole("button", {
      name: "<",
    })
    const nextButton = screen.getByRole("button", {
      name: ">",
    })

    // when
    fireEvent.click(nextButton)

    // then
    expect(previousButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it("1 페이지일 경우 previous 페이지네이션 이동 버튼이 disabled 상태이다.", () => {
    // given, when
    renderBottomSheet()

    const previousButton = screen.getByRole("button", {
      name: "<",
    })

    // then
    expect(previousButton).toBeDisabled()
  })

  it("마지막 페이지일 경우 next 페이지네이션 이동 버튼이 disabled 상태이다.", () => {
    // given
    renderBottomSheet()

    const nextButton = screen.getByRole("button", {
      name: ">",
    }) as HTMLButtonElement

    // when
    while (!nextButton.disabled) {
      fireEvent.click(nextButton)
    }

    // then
    expect(nextButton).toBeDisabled()
  })

  it("페이지네이션 input이 렌더링된다.", () => {
    // given, when
    renderBottomSheet()

    const paginationInput = screen.getByDisplayValue("1")

    // then
    expect(paginationInput).toBeInTheDocument()
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
