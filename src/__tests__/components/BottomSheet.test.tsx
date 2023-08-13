import type {HTMLAttributes} from "react"
import {render, fireEvent, screen} from "@testing-library/react"
import BottomSheet from "@/components/BottomSheet"

jest.mock("../../assets/icons/close.svg", () => ({
  __esModule: true,
  default: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>close</svg>
  ),
}))

describe("BottomSheet", () => {
  beforeAll(() => {
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it("isOpen props가 true면 background는 open 클래스명을 가져야 한다.", () => {
    // given, when
    render(
      <BottomSheet isOpen={true} onClose={jest.fn()}>
        Content
      </BottomSheet>
    )

    const background = screen.getByRole("article")

    // then
    expect(background.classList).toContain("open")
  })

  it("isOpen props가 false면 background는 close 클래스명을 가져야 한다.", () => {
    // given, when
    render(
      <BottomSheet isOpen={false} onClose={jest.fn()}>
        Content
      </BottomSheet>
    )

    const background = screen.getByRole("article")

    // then
    expect(background.classList).toContain("close")
  })

  it("isHandlingHistory props가 true면 이벤트 리스너(popstate) API가 호출되어야 한다.", () => {
    // given, when
    const {unmount} = render(
      <BottomSheet isOpen={true} onClose={jest.fn()} isHandlingHistory={true}>
        Content
      </BottomSheet>
    )

    // then
    expect(window.addEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    )

    // when
    unmount()

    // then
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    )
  })

  it("background가 클릭될 때 onClose가 호출되어야 한다.", () => {
    // given
    const onCloseMock = jest.fn()

    render(
      <BottomSheet isOpen={true} onClose={onCloseMock}>
        Content
      </BottomSheet>
    )
    const background = screen.getByRole("article")

    // when
    fireEvent.click(background)

    // then
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it("wrapper가 클릭될 때 onClose가 호출되지 말아야 한다.", () => {
    // given
    const onCloseMock = jest.fn()

    render(
      <BottomSheet isOpen={true} onClose={onCloseMock}>
        Content
      </BottomSheet>
    )

    const wrapper = screen.getByRole("button").closest("div") as HTMLDivElement

    // when
    fireEvent.click(wrapper)

    // then
    expect(onCloseMock).not.toBeCalled()
  })

  it("isShowingClose가 false면 닫기 버튼이 렌더링되지 말아야 한다.", () => {
    // given, when
    render(
      <BottomSheet isOpen={true} isShowingClose={false} onClose={jest.fn()}>
        content
      </BottomSheet>
    )

    const closeButton = screen.queryByRole("button")

    // then
    expect(closeButton).not.toBeInTheDocument()
  })

  it("isShowingClose가 true면 닫기 버튼이 렌더링되어야 한다.", () => {
    // given, when
    render(
      <BottomSheet isOpen={true} isShowingClose={true} onClose={jest.fn()}>
        content
      </BottomSheet>
    )

    const closeButton = screen.getByRole("button")

    // then
    expect(closeButton).toBeInTheDocument()
  })

  it("isShowingClose가 true일 때 닫기 버튼을 누르면 onClose가 호출되어야 한다.", () => {
    // given
    const onCloseMock = jest.fn()

    render(
      <BottomSheet isOpen={true} isShowingClose={true} onClose={onCloseMock}>
        content
      </BottomSheet>
    )

    const closeButton = screen.getByRole("button")

    // when
    fireEvent.click(closeButton)

    // then
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
